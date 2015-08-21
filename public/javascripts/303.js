$(function() {
//=============== Waveform Selection Received from Server =====================//
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


//================ Delay Notifications Received from Server ==================//
socket.on('delayNotification',function(data) {
      delayTimeDisplay.innerHTML = data.time;
      delayTime.value = data.time;
      delayFeedbackDisplay.innerHTML = data.feedback;
      delayFeedback.value = data.feedback;
      delayCutoffDisplay.innerHTML = data.cutoff;
      delayCutoff.value = data.cutoff;
 });


//================ Pitch Notifications Received from Server ==================//
socket.on('pitchNotification',function(data) {
    baseOctaveDisplay.innerHTML = data.octave - 1;
    basePitchDisplay.innerHTML = serial[data.base];    
    filter01Display.innerHTML = data.filter;

    baseOctave.value = data.octave;
    basePitch.value = data.base;
    filter01.value = data.filter
 });


//================= Watchers =======================//
var $sliders = $('.slider');
$sliders.on('change', function(e) {
  pitchesArray[ $(this).index() ] = $(this).val();
  socket.emit('sequencerPitchValues', pitchesArray);
});

var $mutes = $('.muteBox:checkbox');
$mutes.on('change', function(e) {
  mutedArray[ $(this).index() ] = $(this).is(':checked');
  socket.emit('sequencerMuteBroadcast', mutedArray);
});

var $accents = $('.accentBox:checkbox');
$accents.on('change', function(e) {
  accentArray[ $(this).index() ] = $(this).is(':checked');
  socket.emit('sequencerAccentBroadcast', accentArray);
});


//================ OSCILLATOR TYPE==================//
var selectWaveform = function (data) {
      $('#' + data.id);// Passes button id
    }


scheduleSynth = function (current16thNote, time) {
    currentNote = ++currentNote % pitchesArray.length;
    monoSynth((pitchesArray[current16thNote-1]), time, current16thNote -1, mutedArray[current16thNote-1], accentArray[current16thNote-1]);
}


//TODO: ALL MUTE, OCTAVE, GLIDE, FILTER MOVEMENT, REVERB
//ACCENT IN PROGRESS: not quite right , but working
monoSynth = function (note, time, current, mute, accent) {
  var oscillator = audioContext.createOscillator();
  var gainNode = audioContext.createGain();
  var delayNode = audioContext.createDelay();
  var feedback = audioContext.createGain();
  var delayFilter = audioContext.createBiquadFilter();
  var muteGainNode = audioContext.createGain();
  var accentGainNode = audioContext.createGain();
  var filterNode = audioContext.createBiquadFilter();
  var type = oscType;
  var filter01Freq= filter01.value;
  var muted = mute;
  var accented = accent;

//OSC > Filter > Env > Mute > Accent > Delay
  oscillator.type = type;
  oscillator.frequency.value = mtof(note);
  oscillator.start(time);
  oscillator.stop(time + noteLength);
  oscillator.connect(analyser);
  oscillator.connect(filterNode);
  
  filterNode.type = 'lowpass';
  filterNode.frequency.value = filter01Freq;
  filterNode.Q.value = 0;
  filterNode.gain.value = 0;
  filterNode.connect(gainNode);

  gainNode.gain.setValueAtTime(0, time);
  gainNode.gain.linearRampToValueAtTime(1, time + attack);
  gainNode.gain.linearRampToValueAtTime(0, time + noteLength);
  gainNode.connect(muteGainNode);

  if(muted) {
    muteGainNode.gain.value = 1;
  } else {
    muteGainNode.gain.value = 0;
  }
  muteGainNode.connect(accentGainNode);

  if(accented) {
    accentGainNode.gain.value = 1;
  } else {
    accentGainNode.gain.value = 0.8;
  }
  accentGainNode.connect(audioContext.destination);
  accentGainNode.connect(delayNode);

  delayNode.delayTime.value = delayTime.value;
  feedback.gain.value = delayFeedback.value;
  delayFilter.frequency.value = delayCutoff.value;

  delayNode.connect(feedback);
  feedback.connect(delayFilter);
  delayFilter.connect(delayNode);
  delayNode.connect(audioContext.destination);
}


mtof = function (note) {
  var octaveMultiplier = baseOctave.value;
  var octave = octaveMultiplier * 12;
  var pitchAdder = 69 - parseInt(basePitch.value);
  return ( Math.pow(2, (note-pitchAdder+octave) / 12) ) * 440.0;
}


});
