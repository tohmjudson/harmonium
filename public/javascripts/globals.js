//Program Globals
var socket = io();
var audioContext = new (window.AudioContext || window.webkitAudioContext);

//====================== Transport ==========================//
var isPlaying = false,
    tempo = 120.0,
    current16thNote = 1,
    futureTickTime = 0.0,
    timerID = 0,
    lookahead    = 0.1,
    intervalTime = 25,
    nextNoteTime = null, // when the next note is happening
    currentNote  = 0, // the index of the current note from 0 - 15
    intervalId   = null; // the id of the setInterval lookahead


//====================== 303 ==========================//
//monoSynth Arrays
var pitchesArray = [0, 2, 4, 5, 7, 9, 11, 12, 11, 9, 7, 5, 4, 2, 0, 7],
    mutedArray = [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],
    accentArray = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];

//monoSynth
var oscType = 'sine',
    baseOctave = document.getElementById('baseOctave'),
    baseOctaveDisplay = document.getElementById('baseOctaveDisplay'),
    basePitch = document.getElementById('basePitch'),
    basePitchDisplay = document.getElementById('basePitchDisplay'),
    filter01 = document.getElementById('filter01'),
    filter01Display = document.getElementById('filter01Display'),
    delayTime = document.getElementById('delayTime'),
    delayTimeDisplay = document.getElementById('delayTimeDisplay'),
    delayFeedback = document.getElementById('delayFeedback'),
    delayFeedbackDisplay = document.getElementById('delayFeedbackDisplay'),
    delayCutoff = document.getElementById('delayCutoff'),
    delayCutoffDisplay = document.getElementById('delayCutoffDisplay'),
    noteLength = (60/tempo)/4,
    attack = 1/64;

//====================== 808 ==========================//
// Load samples 
var kick = audioFileLoader("sounds/kick.mp3"),
    snare = audioFileLoader("sounds/snare.mp3"),
    hihat = audioFileLoader("sounds/hihat.mp3"),
    shaker = audioFileLoader("sounds/shaker.mp3");

// Track Que 
var track1Que = [],
    track2Que = [],
    track3Que = [],
    track4Que = [];

// Track Array 
var track1 = [],
    track2 = [],
    track3 = [],
    track4 = [];


//===================== Utility ===================//
//Visual
var analyser = audioContext.createAnalyser();

//Pitch to text conversion
var serial = [ 'C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B', 'C'];