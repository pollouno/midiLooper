import { Looper } from './looper.mjs';
import { Note } from 'webmidi';

const looper = new Looper(OnLoad, OnTick);
window.looper = looper;

const bpmRange       = document.getElementById("bpm-range");
const bpmLabel       = document.getElementById("bpm-label");
const progressBar    = document.getElementById("progress-bar");
const progressLabel  = document.getElementById("progress-label");
const timeLabel      = document.getElementById("time");

const recButton      = document.getElementById("rec-button");
const playButton    = document.getElementById("play-button");
const undoButton     = document.getElementById("undo-button");
const clearButton    = document.getElementById("clear-button");

bpmRange   .oninput = () => { looper.SetBPM(bpmRange.value); };
recButton  .onclick = () => { looper.input.OnTrackButton(0, 0); };
playButton .onclick = () => { looper.input.OnTrackButton(0, 1); };
undoButton .onclick = () => { looper.input.OnTrackButton(0, 3); };
clearButton.onclick = () => { looper.input.OnTrackButton(0, 4); };

looper.track.AddTrack();

function OnLoad()
{
    let oo = looper.GetOutputs();

    const outputList = document.getElementById("output-list");
    outputList.onchange = () => {
        let value = outputList.value;
        if(value == "none")
            looper.SetOutput(null);
        else
            looper.SetOutput(value);
    };
    outputList.innerHTML = '<option value="none">Select an output</option>';
    oo.forEach(out => {
        outputList.innerHTML += `<option value="${out.id}">${out.name}</option>`
        if(looper.current.output == null) {
            looper.SetOutput(out.id);
            outputList.value = out.id;
        }
    });

    console.log('All loaded successfully!');
}

function OnTick()
{
    UpdateUI();
}

function UpdateUI()
{
    const track = looper.current.Track();
    window.track = track;

    bpmLabel.innerHTML = `${ looper.current.bpm } BPM (${ Math.round(looper.current.measureLength / looper.MEASURE_LENGTH) }ms)`;
    progressLabel.innerHTML = `${ track.time.toFixed(2) }/${ track.trackLength.toFixed(2) }  - ${ track.state }`
    timeLabel.innerHTML = looper.current.time.toFixed(2);

    if(track.trackLength == -1)
        progressBar.style.width = 0;
    else {
        let w = Math.round((track.time / track.trackLength) * 100);
        progressBar.style.width = w + '%';
    }
}

addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'a':
            looper.OnNoteOn(new Note(60));
            break;
        case 's':
            looper.OnNoteOn(new Note(62));
            break;
        case 'd':
            looper.OnNoteOn(new Note(64));
            break;
        case 'f':
            looper.OnNoteOn(new Note(65));
            break;
        case 'g':
            looper.OnNoteOn(new Note(67));
            break;
        case 'h':
            looper.OnNoteOn(new Note(69));
            break;
    }
});

addEventListener('keyup',   (e) => {
    switch(e.key) {
        case 'a':
            looper.OnNoteOff(new Note(60));
            break;
        case 's':
            looper.OnNoteOff(new Note(62));
            break;
        case 'd':
            looper.OnNoteOff(new Note(64));
            break;
        case 'f':
            looper.OnNoteOff(new Note(65));
            break;
        case 'g':
            looper.OnNoteOff(new Note(67));
            break;
        case 'h':
            looper.OnNoteOff(new Note(69));
            break;
    }
});
