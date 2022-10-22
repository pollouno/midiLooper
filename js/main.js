import { Looper } from "./looper.js";

const bpmLabel      = document.getElementById("bpm-label");
const beatLabel     = document.getElementById("beat");
const measureLabel  = document.getElementById("measure");
const beatTimeLabel = document.getElementById("beatTime");

const playButton  = document.getElementById("play-button" );
const pauseButton = document.getElementById("pause-button");

function SetInOutValues()
{
    
}

function UpdateUI() {
    beatTimeLabel.innerHTML = looper.current.beatTime.toFixed(2);
    beatLabel.innerHTML = looper.current.beat % 4;
    measureLabel.innerHTML = looper.current.measure;
    
    bpmLabel.innerHTML = `${looper.bpm} (${looper.bpmInMs} ms)`;
    
    if(looper.isPlaying) {
        playButton.style.display  = "none";
        pauseButton.style.display = "inline-block";
    }
    else {
        playButton.style.display  = "inline-block";
        pauseButton.style.display = "none";
    }
}


var looper = new Looper();
looper.Init(null, UpdateUI);

UpdateUI();