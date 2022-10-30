import { Track } from "./track.mjs";

function Looper(onTickCallback = null) {
    this.MAX_TRACK_LENGTH  = 16;    //In measures!
    this.MEASURE_LENGTH    = 4;

    this.current = {
        bpm : 120,
        measureLength : 2000,   //In ms!
        track : -1,
        Track : () => this.current.track == -1 ? null : this.track.trackArray[this.current.track],
        isRecording : false
    }

    this.track = {
        AddTrack : () => {
            this.track.trackArray.splice(this.track.Count() - 1, 0, new Track(this));
            this.current.track = this.track.Count() - 1;
        },
        RemoveTrack : (trackID) => { this.trackArray.splice(trackID, 1); this.current.track = -1; },
        AreEmpty : () => {
            this.track.trackArray.forEach(t => {
                if(!t.IsEmpty())
                    return false;
            });
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
            
        },
        OnTrackButton : (track, button) => {
            let changedTrack = false;
            if(track != this.current.track) {
                this.track.trackArray[this.current.track].OnDeselect();
                this.track.trackArray[track].OnSelect();

                this.current.track = track;
                changedTrack = true;
            }

            switch(button) {
                case REC_BUTTON:
                    this.current.isRecording = changedTrack ? true : !this.current.isRecording;
                    if(!this.current.isRecording)
                        this.current.Track().EndSession();
                    break;
               case PLAY_BUTTON:
                    if(!this.current.Track().IsPlaying())
                        this.current.Track().Play();
                    else
                        this.current.Track().Pause();
                    break;
                case STOP_BUTTON:
                    this.current.Track().Stop();
                    break;
                case UNDO_BUTTON:
                    this.current.Track().Undo();
                    break;
                case CLEAR_BUTTON:
                    this.current.Track().Clear();
                    break;
            }
        }
    }

    this.aux = {
        lTick : 0,
        tickInterval : null
    }

    this.SetBPM = (bpm) => {
        this.current.bpm = bpm;
        this.current.measureLength = Math.round((60000 / bpm) * this.MEASURE_LENGTH);
    }

    this.OnTick = () => {
        if(this.aux.lTick <= 0) {
            this.aux.lTick = performance.now();
            return;
        }

        const delta = (performance.now() - this.aux.lTick) / this.current.measureLength;
        this.current.time = (this.current.time + delta) % this.MAX_TRACK_LENGTH;
        this.track.trackArray.forEach(t => { t.OnTick(delta); });

        this.aux.lTick = performance.now();
    }

    this.OnNoteOn  = (msg) => {
        //Passthrough to channel !

        if(this.current.isRecording)
            this.current.Track().RecordMessage(msg);
    };
    this.OnNoteOff = (msg) => {
        //Passthrough to channel !

        if(this.current.isRecording)
            this.current.Track().RecordMessage(msg);
    };

    this.aux.tickInterval = setInterval(() => { this.OnTick(); onTickCallback?.(); });
}