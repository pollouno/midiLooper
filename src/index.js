import { Looper } from './looper.mjs';
import { Note } from 'webmidi';

const looper = new Looper(OnLoad, OnTick);
window.looper = looper;

const bpmRange       = document.getElementById("bpm-range");
const bpmLabel       = document.getElementById("bpm-label");
const trackList      = document.getElementById("track-list");
const trackTemplate  = document.getElementById("track-template");
const addTrackButton = document.getElementById("addtrack-button");
const channelRange   = document.getElementById("channel-select");
const channelLabel   = document.getElementById("channel-label");

var selectedTrack = 0;

bpmRange.oninput = () => { looper.SetBPM(bpmRange.value); };
addTrackButton.onclick = () => { AddTrack(); };
channelRange.oninput = () => { looper.track.trackArray[selectedTrack].SetChannel(channelRange.value);}

function OnLoad()
{
    let oo = looper.GetOutputs();
    
    const outputList = document.getElementById("output-list");
    looper.SetOutput();
    
    window.outputList = outputList;

    outputList.onchange = () => {
        let value = outputList.value;
        if(value == "none")
            looper.SetOutput(null);
            else
            looper.SetOutput(value);
    };
    outputList.innerHTML = '<option value="none">Select an output</option>';
    oo.forEach(out => {
        outputList.innerHTML += `<option value="${out.name}">${out.name}</option>`
    });
    
    if(oo.length > 0) {
        let id = oo[0].name;
        looper.SetOutput(id);
        outputList.value = id;
    }
    
    let ii = looper.GetInputs();
    
    const inputList = document.getElementById("input-list");
    looper.SetInput();
    
    window.inputList = inputList;
    
    inputList.onchange = () => {
        let value = inputList.value;
        if(value == "none")
        looper.SetInput(null);
        else
            looper.SetInput(value);
        };
        inputList.innerHTML = '<option value="none">Select an input</option>';
        ii.forEach(i => {
            inputList.innerHTML += `<option value="${i.name}">${i.name}</option>`
    });

    if(ii.length > 0) {
        let id = ii[0].name;
        looper.SetOutput(id);
        outputList.value = id;
    }

    console.log('All loaded successfully!');
}

function OnTick()
{
    UpdateUI();
}

function UpdateUI()
{
    bpmLabel.innerHTML = `${ looper.current.bpm } BPM (${ Math.round(looper.current.measureLength / looper.MEASURE_LENGTH) }ms)`;
    bpmRange.value = looper.current.bpm;
    
    for (let i = 0; i < trackList.children.length; i++) {
        const trackElement = trackList.children[i];
        const track = looper.track.trackArray[i];
        const progressBar    = trackElement.querySelector("#progress-bar");
        const progressLabel  = trackElement.querySelector("#progress-label");
        
        progressLabel.innerHTML = `${ track.time.toFixed(2) }/${ track.trackLength.toFixed(2) }  - ${ track.state }`
        
        if(track.trackLength == -1)
            progressBar.style.width = 0;
        else {
            let w = Math.round((track.time / track.trackLength) * 100);
            progressBar.style.width = w + '%';
        }
    }

    if(selectedTrack < looper.track.Count()) {
        var ch = looper.track.trackArray[selectedTrack].toChannel;
        channelLabel.innerHTML = `Send to Channel: ${ch == 0 ? 'ALL' : ch}`;
        channelRange.value = ch;
    }
}

function SelectTrack(id) {
    selectedTrack = id;
    UpdateTrackElements();
}

function AddTrack() {
    const t = trackTemplate.cloneNode(true);
    const id = trackList.children.length;
    t.style.display = 'block';
    t.trackId = 'bleh';
    trackList.append(t);

    InitTrackElement(t, id);

    looper.track.AddTrack();
    console.log(`Added track ${id}!`);
}

function RemoveTrack(id) {
    looper.track.RemoveTrack(id);
    trackList.lastChild.remove();

    UpdateTrackElements();
    console.log(`Removed track ${id}!`);
}

function InitTrackElement(element, id) {
    let n = id;
    
    const recButton   = element.querySelector("#rec-button");
    const playButton  = element.querySelector("#play-button");
    const undoButton  = element.querySelector("#undo-button");
    const clearButton = element.querySelector("#clear-button");
    const delButton   = element.querySelector("#delete-button");

    recButton  .onclick = () => { looper.input.OnTrackButton(n, 0); };
    playButton .onclick = () => { looper.input.OnTrackButton(n, 1); };
    undoButton .onclick = () => { looper.input.OnTrackButton(n, 3); };
    clearButton.onclick = () => { looper.input.OnTrackButton(n, 4); };
    delButton.onclick = () => { RemoveTrack(n); };
    
    element.onclick = () => SelectTrack(n);
    element.style.backgroundColor = id == selectedTrack ? 'lightyellow' : 'transparent';
}

function UpdateTrackElements() {
    for (let i = 0; i < trackList.children.length; i++) {
        const t = trackList.children[i];
        InitTrackElement(t, i);
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

AddTrack();