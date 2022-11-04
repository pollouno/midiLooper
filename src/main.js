import { Looper } from "./looper.mjs";

const bpmLabel      = document.getElementById("bpm-label");

const playButton  = document.getElementById("play-button" );
const pauseButton = document.getElementById("pause-button");
const recButton   = document.getElementById("rec-button");

const trackLabelA = document.getElementById("track-labelA");
const trackLabelB = document.getElementById("track-labelB");
const trackLabelC = document.getElementById("track-labelC");
const trackLabelD = document.getElementById("track-labelD");

const trackTimeA = document.getElementById("track-timeA");
const trackLengthA = document.getElementById("track-lengthA");
const trackMsgCountA = document.getElementById("track-msg-countA");
const trackTimeB = document.getElementById("track-timeB");
const trackLengthB = document.getElementById("track-lengthB");
const trackMsgCountB = document.getElementById("track-msg-countB");
const trackTimeC = document.getElementById("track-timeC");
const trackLengthC = document.getElementById("track-lengthC");
const trackMsgCountC = document.getElementById("track-msg-countC");
const trackTimeD = document.getElementById("track-timeD");
const trackLengthD = document.getElementById("track-lengthD");
const trackMsgCountD = document.getElementById("track-msg-countD");


const trackSelectA = document.getElementById("select-trackA");
const trackMuteA   = document.getElementById("mute-trackA");
const trackSelectB = document.getElementById("select-trackB");
const trackMuteB   = document.getElementById("mute-trackB");
const trackSelectC = document.getElementById("select-trackC");
const trackMuteC   = document.getElementById("mute-trackC");
const trackSelectD = document.getElementById("select-trackD");
const trackMuteD   = document.getElementById("mute-trackD");

function SetInOutValues()
{
    
}

function UpdateUI() {
    bpmLabel.innerHTML = `${looper.bpm} (${looper.bpmInMs} ms)`;
    
    playButton.style.display  = looper.isPlaying ? "none" : "inline-block";
    pauseButton.style.display = looper.isPlaying ? "inline-block" : "none";
    recButton.style.backgroundColor = looper.isRecording ? "red" : "buttonface";
    trackLabelA.style.fontWeight = looper.current.track == 0 ? "bold" : "normal";
    trackLabelB.style.fontWeight = looper.current.track == 1 ? "bold" : "normal";
    trackLabelC.style.fontWeight = looper.current.track == 2 ? "bold" : "normal";
    trackLabelD.style.fontWeight = looper.current.track == 3 ? "bold" : "normal";

    trackTimeA.innerHTML = looper.tracks[0].time.toFixed(2);
    trackLengthA.innerHTML = looper.tracks[0].trackLength.toFixed(2);
    trackMsgCountA.innerHTML = looper.tracks[0].messages.length;

    trackTimeB.innerHTML = looper.tracks[1].time.toFixed(2);
    trackLengthB.innerHTML = looper.tracks[1].trackLength.toFixed(2);
    trackMsgCountB.innerHTML = looper.tracks[1].messages.length;

    trackTimeC.innerHTML = looper.tracks[2].time.toFixed(2);
    trackLengthC.innerHTML = looper.tracks[2].trackLength.toFixed(2);
    trackMsgCountC.innerHTML = looper.tracks[2].messages.length;

    trackTimeD.innerHTML = looper.tracks[3].time.toFixed(2);
    trackLengthD.innerHTML = looper.tracks[3].trackLength.toFixed(2);
    trackMsgCountD.innerHTML = looper.tracks[3].messages.length;

    trackSelectA.disabled = looper.current.track == 0;
    trackSelectB.disabled = looper.current.track == 1;
    trackSelectC.disabled = looper.current.track == 2;
    trackSelectD.disabled = looper.current.track == 3;

    trackMuteA.innerHTML = looper.tracks[0].isMuted ? "Unmute" : "Mute";
    trackMuteB.innerHTML = looper.tracks[1].isMuted ? "Unmute" : "Mute";
    trackMuteC.innerHTML = looper.tracks[2].isMuted ? "Unmute" : "Mute";
    trackMuteD.innerHTML = looper.tracks[3].isMuted ? "Unmute" : "Mute";
}


window.looper = new Looper();
window.looper.Init(null, UpdateUI);

UpdateUI();