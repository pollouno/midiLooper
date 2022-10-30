import { Track } from './track.mjs';

function Looper() {
    this.TRACK_COUNT       = 4;
    this.MAX_TRACK_LENGTH  = 16;    //In measures!
    this.MEASURE_LENGTH    = 4;
    
    this.bpm = 120;
    this.bpmInMs = 500;
    this.isPlaying = false;
    this.isRecording = false;
    this.isErasing = false;
    this.current = {
        track : 0,
        time : 0
    };
    this.aux = {
        lTime: -1,
        tickHandler: null
    };
    this.Init = (onInitCallback = null, onTickCallback = null) => {
        this.aux.tickHandler = setInterval(() => { this.OnTick(); onTickCallback?.()}, 5);
        onInitCallback?.();
    };
    this.OnTick = () => {
        if (!this.isPlaying)
            return;
        if (this.aux.lTime <= 0) {
            this.aux.lTime = performance.now();
            return;
        }

        let delta = (performance.now() - this.aux.lTime) / (this.bpmInMs * this.MEASURE_LENGTH); //delta 
        this.current.time = (this.current.time + delta) % this.MAX_TRACK_LENGTH;

        for (let i = 0; i < this.TRACK_COUNT; i++) {
            this.tracks[i].OnTick(delta);
        }
        this.aux.lTime = performance.now();
    };
    this.SetBPM = (bpm) => {
        this.bpm = bpm;
        this.bpmInMs = Math.round(60000 / bpm);
    };
    this.Play = () => { this.isPlaying = true; };
    this.Pause = () => { this.isPlaying = false; };
    this.Stop = () => {
        this.current.beatTime = 0;
        this.aux.lTime = -1;
        this.tracks.forEach((t) => { t.Stop(); })
        this.Pause();
        if(this.isRecording)
            this.ToggleRec();
    };
    
    this.ToggleRec = () => {
        this.isRecording = !this.isRecording;
    
        if(!this.isPlaying && this.isRecording)
            this.Play();
    };
    
    this.ResetTrack = () => {
        this.tracks[this.current.track].ClearAll();
    };
    this.CutTrack = () => {
        this.tracks[this.current.track].SetTrackLength();
    };
    
    this.OnNoteOn  = (message) => {
        
    };
    
    this.OnNoteOff = (message) => {
    
    };
    this.SetErasingMode = (b) => { this.isErasing = b; }
    this.ChangeTrack = (t) => { this.current.track = t; };
    this.tracks = [];
    for (let i = 0; i < this.TRACK_COUNT; i++) {
        this.tracks[i] = new Track(this);
    };
    this.ExecuteMessage = (msg) => {

    };
};

export { Looper };