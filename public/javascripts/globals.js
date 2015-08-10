var bpm          = 240; //NOT BPM!
var noteLength   = bpm / 60 * (1/8);
var attack       = 1/64;
var lookahead    = 0.04;
var intervalTime = 25;

// these will keep track of the state of the sequencer:
var nextNoteTime = null; // when the next note is happening
var currentNote  = 0; // the index of the current note from 0 - 15
var intervalId   = null; // the id of the setInterval lookahead

var socket = io();
var oscType = 'sine';

var audioContext = new (window.AudioContext || window.webkitAudioContext);
var analyser = audioContext.createAnalyser();

var values = [0, 2, 4, 5, 7, 9, 11, 12, 11, 9, 7, 5, 4, 2, 0, 7];
var mutedArray = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];

var serial = [ 'C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B', 'C']
