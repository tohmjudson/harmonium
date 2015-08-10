$(function() {

//Key Press
$('.key').click(function () {
  var keyData = {
    id: $(this).attr('id')
  }
  socket.emit('keyPress', keyData);
});

socket.on('keyPressed', function(data){
  selectWaveform(data);
      switch (data['id']) {
        case '0':
        oscType = 'sine';
            break;
            case '1':
            oscType = 'sawtooth';
            break;
            case '2':
            oscType = 'triangle';
            break;
          };
  });

var selectWaveform = function (data) {
      $('#' + data.id);// Passes button id
    }

//TODO: ALL MUTE, GLIDE, FILTER MOVEMENT, REVERB
scheduleNote = function (note, time, current, mute) {
  var oscillator = audioContext.createOscillator();
  var gainNode = audioContext.createGain();
  var muteGainNode = audioContext.createGain();
  var filterNode = audioContext.createBiquadFilter();
  var type = oscType;
  var filter01Freq= filter01.value;
  var muted = mute;

  if(muted) {
    muteGainNode.gain.value = 1;
  } else {
    muteGainNode.gain.value = 0;
  }
  muteGainNode.connect(audioContext.destination);

  var delayNode = audioContext.createDelay();
  delayNode.delayTime.value = delayTime.value;
  
  var feedback = audioContext.createGain();
  feedback.gain.value = delayFeedback.value;
  
  var delayFilter = audioContext.createBiquadFilter();
  delayFilter.frequency.value = delayCutoff.value;

  delayNode.connect(feedback);
  feedback.connect(delayFilter);
  delayFilter.connect(delayNode);


  delayNode.connect(audioContext.destination);
  
  oscillator.type = type;
  oscillator.frequency.value = mtof(note);
  oscillator.connect(filterNode);
  
  gainNode.connect(muteGainNode);
  muteGainNode.connect(delayNode);

  gainNode.gain.setValueAtTime(0, time);
  gainNode.gain.linearRampToValueAtTime(1, time + attack);
  gainNode.gain.linearRampToValueAtTime(0, time + noteLength);
  oscillator.start(time);
  oscillator.stop(time + noteLength);
  oscillator.connect(analyser);

  filterNode.connect(gainNode);
  filterNode.type = 'lowpass';
  filterNode.frequency.value = filter01Freq;
  filterNode.Q.value = 0;
  filterNode.gain.value = 0;
}


mtof = function (note) {
  var octaveMultiplier = baseOctave.value;
  var octave = octaveMultiplier * 12;
  var pitchAdder = 69 - parseInt(basePitch.value);
  return ( Math.pow(2, (note-pitchAdder+octave) / 12) ) * 440.0;
}


});
