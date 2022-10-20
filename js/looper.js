var looper = {
    bpm: 120,
    bpmInMs: 500,
    divisions: 4,
    isPlaying: false,
    isRecording : false,
    current: {
        beatTime: 0,
        beat: 0,
        division: 0,
        measure: 0,
        patternLength: 8
    },
    aux: {
        lTime: -1,
        tickHandler: null
    }
};

looper.Init = (onInitCallback = null, onTickCallback = null) => {
    looper.aux.tickHandler = setInterval(() => { looper.OnTick(); onTickCallback?.()}, 5);
    onInitCallback?.();
}

looper.OnTick = () => {
    if (!looper.isPlaying)
        return;
    if (looper.aux.lTime <= 0) {
        looper.aux.lTime = performance.now();
        return;
    }

    const delta = performance.now() - looper.aux.lTime;

    looper.current.beatTime += delta / looper.bpmInMs;
    looper.current.beatTime %= 4 * looper.current.patternLength;
    looper.current.beat = Math.floor(looper.current.beatTime);
    looper.current.measure = Math.floor(looper.current.beat / 4);

    looper.aux.lTime = performance.now();

    const lDiv = looper.current.division;
    looper.current.division = Math.floor((looper.current.beatTime % 1).toFixed(4) * looper.divisions);

    if(lDiv != looper.current.division)
        OnDivision();
}

looper.SetBPM = (bpm) => {
    looper.bpm = bpm;
    looper.bpmInMs = Math.round(60000 / bpm);
}


looper.Play = () => { looper.isPlaying = true; }
looper.Pause = () => { looper.isPlaying = false; }
looper.Stop = () => {
    looper.current.beatTime = 0;
    looper.current.beat = 0;
    looper.current.division = 0;
    looper.current.measure = 0;
    looper.aux.lTime = -1;
    looper.Pause();
    if(looper.isRecording)
        looper.ToggleRec();
}

looper.ToggleRec = () => {
    looper.isRecording = !looper.isRecording;

    if(!looper.isPlaying && looper.isRecording)
        looper.Play();
}

looper.ClearRec = () => {

}

looper.OnDivision = () => {

}

looper.OnNoteOn  = (message) => {
    
}

looper.OnNoteOff = (message) => {

}