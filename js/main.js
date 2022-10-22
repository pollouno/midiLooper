import { Looper } from "./looper.mjs";

const bpmLabel      = document.getElementById("bpm-label");

const playButton  = document.getElementById("play-button" );
const pauseButton = document.getElementById("pause-button");

function SetInOutValues()
{
    
}

function UpdateUI() {
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


window.looper = new Looper();
window.looper.Init(null, UpdateUI);

UpdateUI();