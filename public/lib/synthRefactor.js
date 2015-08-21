$(function() {

Synthesizer = function (audioContext){
	this.audioContext = new (window.AudioContext || window.webkitAudioContext);
	this.oscillator = audioContext.createOscillator();
	this.gainNode = audioContext.createGain();
	this.delayNode = audioContext.createDelay();
	this.feedback = audioContext.createGain();
	this.delayFilter = audioContext.createBiquadFilter();
	this.muteGainNode = audioContext.createGain();
	this.accentGainNode = audioContext.createGain();
	this.filterNode = audioContext.createBiquadFilter();

	this.type = oscType;
	this.filter01Freq= filter01.value;
	this.muted = mute;
	this.accented = accent;

};

Synthesizer.prototype.scheduleNote = function (note, time, current, mute, accent) {

};


});