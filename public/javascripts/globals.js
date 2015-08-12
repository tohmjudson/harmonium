//Program Globals
var socket = io();
var audioContext = new (window.AudioContext || window.webkitAudioContext);

//Sequencer
var bpm          = 60;
var noteLength   = (60/bpm )/4;
var attack       = 1/64;
var lookahead    = 0.04;
var intervalTime = 25;
var nextNoteTime = null; // when the next note is happening
var currentNote  = 0; // the index of the current note from 0 - 15
var intervalId   = null; // the id of the setInterval lookahead

var values = [0, 2, 4, 5, 7, 9, 11, 12, 11, 9, 7, 5, 4, 2, 0, 7];
var mutedArray = [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true];

//Synth
var oscType = 'sine';
var baseOctave = document.getElementById('baseOctave');
var baseOctaveDisplay = document.getElementById('baseOctaveDisplay');
var basePitch = document.getElementById('basePitch');
var basePitchDisplay = document.getElementById('basePitchDisplay');
var filter01 = document.getElementById('filter01');
var filter01Display = document.getElementById('filter01Display');


//Delay
var delayTime = document.getElementById('delayTime');
var delayTimeDisplay = document.getElementById('delayTimeDisplay');
var delayFeedback = document.getElementById('delayFeedback');
var delayFeedbackDisplay = document.getElementById('delayFeedbackDisplay');
var delayCutoff = document.getElementById('delayCutoff');
var delayCutoffDisplay = document.getElementById('delayCutoffDisplay');

//Visual
var analyser = audioContext.createAnalyser();

//Utility
var serial = [ 'C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B', 'C'];



/*
var delayData = {
    time: delayTime.value,
    feedback: delayFeedback.value,
    cutoff: delayCutoff.value
    };

var pitchData = {
	octave: baseOctave.value,
	base: basePitch.value,
	filter: filter01.value
};
*/