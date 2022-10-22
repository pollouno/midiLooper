import { Track } from './track.mjs';

function Looper() {
    const TRACK_COUNT = 4;
    
    this.bpm = 120,
    this.bpmInMs = 500,
    this.isPlaying = false,
    this.isRecording = false,
    this.current = {
        track : 0
    },
    this.aux = {
        lTime: -1,
        tickHandler: null
    },
    this.Init = (onInitCallback = null, onTickCallback = null) => {
        this.aux.tickHandler = setInterval(() => { this.OnTick(); onTickCallback?.()}, 5);
        onInitCallback?.();
    },
    this.OnTick = () => {
        if (!this.isPlaying)
            return;
        if (this.aux.lTime <= 0) {
            this.aux.lTime = performance.now();
            return;
        }
    },
    this.SetBPM = (bpm) => {
        this.bpm = bpm;
        this.bpmInMs = Math.round(60000 / bpm);
    },
    this.Play = () => { this.isPlaying = true; },
    this.Pause = () => { this.isPlaying = false; },
    this.Stop = () => {
        this.current.beatTime = 0;
        this.aux.lTime = -1;
        this.Pause();
        if(this.isRecording)
            this.ToggleRec();
    },
    
    this.ToggleRec = () => {
        this.isRecording = !this.isRecording;
    
        if(!this.isPlaying && this.isRecording)
            this.Play();
    },
    
    this.ResetTrack = () => {
    
    },
    
    this.OnNoteOn  = (message) => {
        
    },
    
    this.OnNoteOff = (message) => {
    
    };

    this.ChangeTrack = (t) => { this.current.track = t; }
    this.tracks = [];
    for (let i = 0; i < TRACK_COUNT; i++) {
        this.tracks[i] = new Track(this);
    }
    this.ExecuteMessage = (msg) => {

    }
};

export { Looper };