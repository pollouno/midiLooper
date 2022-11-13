import { Track } from "./track.mjs";
import { WebMidi } from "webmidi";

function Looper(onLoadCallback = null, onTickCallback = null) {
    this.MAX_TRACK_LENGTH  = 16;    //In measures!
    this.MEASURE_LENGTH    = 4;

    this.current = {
        time : 0,
        bpm : 120,
        measureLength : 2000,   //In ms!
        track : -1,
        Track : () => this.current.track == -1 ? null : this.track.trackArray[this.current.track],
        isRecording : false,
        output : null
    }

    this.track = {
        AddTrack : () => {
            this.track.trackArray.splice(this.track.Count() - 1, 0, new Track(this));
            this.current.track = this.track.Count() - 1;
        },
        RemoveTrack : (trackID) => { this.track.trackArray.splice(trackID, 1); this.current.track = -1; },
        AreEmpty : () => {
            for (let i = 0; i < this.track.trackArray.length; i++) {
                const t = this.track.trackArray[i];
                if(!t.IsEmpty())
                    return false;
            }
            return true;
        },
        Count : () => { return this.track.trackArray.length; },
        trackArray : []
    }

    this.input = {
        REC_BUTTON   : 0,
        PLAY_BUTTON  : 1,
        STOP_BUTTON  : 2,
        UNDO_BUTTON  : 3,
        CLEAR_BUTTON : 4,
        OnButton : (button) => {
            this.aux.lTap = 0;
        },
        OnTrackButton : (track, button) => {
            let changedTrack = false;
            this.aux.lTap = 0;
            if(track != this.current.track) {
                this.track.trackArray[this.current.track].OnDeselect();
                this.track.trackArray[track].OnSelect();

                this.current.track = track;
                changedTrack = true;
            }

            switch(button) {
                case this.input.REC_BUTTON:
                    this.current.isRecording = changedTrack ? true : !this.current.isRecording;
                    if(!this.current.isRecording)
                        this.current.Track().EndSession();
                    break;
               case this.input.PLAY_BUTTON:
                    if(!this.current.Track().IsPlaying())
                        this.current.Track().Play();
                    else
                        this.current.Track().Pause();
                    break;
                case this.input.STOP_BUTTON:
                    this.current.Track().Stop();
                    break;
                case this.input.UNDO_BUTTON:
                    this.current.Track().Undo();
                    break;
                case this.input.CLEAR_BUTTON:
                    this.current.Track().Clear();
                    break;
            }
        }
    }

    this.aux = {
        lTick : 0,
        lTap : 0,
        tickInterval : null
    }

    this.SetBPM = (bpm) => {
        this.current.bpm = bpm;
        this.current.measureLength = Math.round((60000 / bpm) * this.MEASURE_LENGTH);
    }
    this.Tap = () => {
        if(this.aux.lTap == 0) {
            this.aux.lTap = performance.now();
            return;
        }
        let t = performance.now() - this.aux.lTap;

        if(t > 1000) {
            this.aux.lTap = 0;
            return;
        }

        this.SetBPM(Math.floor(60000 / t));
        this.aux.lTap = performance.now();
    }

    this.GetInputs  = () => WebMidi.inputs;
    this.GetOutputs = () => WebMidi.outputs;
    this.SetInput = (id = null) => {
        if(!id) {
            this.current.input = null;
            return;
        }
        this.current.input = WebMidi.getInputByName(id);
    };
    this.SetOutput = (id = null) => {
        if(!id) {
            this.current.output = null;
            return;
        }
        this.current.output = WebMidi.getOutputByName(id);
    };
    this.OnTick = () => {
        if(this.track.AreEmpty() && !this.current.isRecording) {
            this.current.time =  0;
            this.aux.lTick    = -1;
            return;
        }
        else if(this.aux.lTick <= 0) {
            this.aux.lTick = performance.now();
            return;
        }
        

        const delta = (performance.now() - this.aux.lTick) / this.current.measureLength;
        if(delta > 0.2)
            console.log(delta);
        this.current.time = (this.current.time + delta) % this.MAX_TRACK_LENGTH;
        this.track.trackArray.forEach(t => { t.OnTick(delta); });

        this.aux.lTick = performance.now();
    }

    this.OnNoteOn  = (msg) => {
        msg = { action: 'noteon', note: msg };
        this.ExecuteMessage(msg);
        
        if(this.current.isRecording)
            this.current.Track().RecordMessage(msg);
    };
    this.OnNoteOff = (msg) => {
        msg = { action: 'noteoff', note: msg };
        this.ExecuteMessage(msg);
        
        if(this.current.isRecording)
            this.current.Track().RecordMessage(msg);
    };
    this.OnTrackStop = (channel) => { this.current.output.sendAllSoundOff(); }
    this.ExecuteMessage = (msg, channel) => {
        let out = channel == 0 ? this.current.output : this.current.output.channels[channel];
        switch(msg.action)
        {
            case 'noteon':
                out.playNote(msg.note);
                break;
            case 'noteoff':
                out.stopNote(msg.note);
                break;
        }
    };

    this.aux.tickInterval = setInterval(() => { this.OnTick(); onTickCallback?.(); }, 4);
    WebMidi.enable().then(() => {
        WebMidi.addListener('noteon' , (e) => { this.OnNoteOn (e); } );
        WebMidi.addListener('noteoff', (e) => { this.OnNoteOff(e); } );
        console.log('WebMidi enabled!');
        onLoadCallback?.();
    })
    .catch( (err) => alert(err) );
}

export { Looper };