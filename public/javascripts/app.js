$(function() {

  var socket = io();
  var oscType = 'sine';

//=============== USER =====================//
    var username = prompt('What\'s your username?');// The visitor is asked for their username...
    socket.emit('newUser', username); // It's sent with the signal "newUser"
    socket.on('message', function (message) { // A log is displayed when the server sends us a "message"
      console.log('SERVER: ' + message);
    })

//=============== EMIT = SUBMIT =====================//
    //Test Connection
    $('#poke').click(function () {
      socket.emit('message', 'Hi server, how are you?');
    })

    //Key Press
    $('.key').click(function () {
      var keyData = {
        id: $(this).attr('id')
      }
      socket.emit('keyPress', keyData);
    });

//=============== ON = LISTEN =====================//
socket.on('keyPressed', function(data){
  playKey(data);

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


socket.on('baseOctaveBroadcast', function (data){
      baseOctaveDisplay.innerHTML = data - 1;
      baseOctave.value = data;
    });

socket.on('basePitchBroadcast', function (data){
      basePitchDisplay.innerHTML = serial[data];
      basePitch.value = data;
    });

socket.on('filterBroadcast', function (data){
      filter01Display.innerHTML = data;
      filter01.value = data;
    });



socket.on('delayTimeBroadcast', function (data){
      delayTimeDisplay.innerHTML = data;
      delayTime.value = data;
    });

socket.on('delayFeedbackBroadcast', function (data){
      delayFeedbackDisplay.innerHTML = data;
      delayFeedback.value = data;
    });


socket.on('delayCutoffBroadcast', function (data){
      delayCutoffDisplay.innerHTML = data;
      delayCutoff.value = data;
    });

socket.on('seqOnOff', function (data){
  //console.log(data);
  $('.checkbox').prop('checked', data);
  if( $('.checkbox').is(':checked')) {
    nextNoteTime = audioContext.currentTime;
    scheduleSequence();
    intervalId = setInterval(scheduleSequence, intervalTime);
  } else {
    intervalId = clearInterval(intervalId);
  }
});

socket.on('seqSliders', function (data){
  values = data;
  $('#slider1').val(values[0]);
  $('#slider2').val(values[1]);
  $('#slider3').val(values[2]);
  $('#slider4').val(values[3]);
  $('#slider5').val(values[4]);
  $('#slider6').val(values[5]);
  $('#slider7').val(values[6]);
  $('#slider8').val(values[7]);
  $('#slider9').val(values[8]);
  $('#slider10').val(values[9]);
  $('#slider11').val(values[10]);
  $('#slider12').val(values[11]);
  $('#slider13').val(values[12]);
  $('#slider14').val(values[13]);
  $('#slider15').val(values[14]);
  $('#slider16').val(values[15]);
});




socket.on('mutedArrayBroadcast', function (data){
  mutedArray = data;
  $('#checkbox01').prop('checked', mutedArray[0]);
  $('#checkbox02').prop('checked', mutedArray[1]);
  $('#checkbox03').prop('checked', mutedArray[2]);
  $('#checkbox04').prop('checked', mutedArray[3]);
  $('#checkbox05').prop('checked', mutedArray[4]);
  $('#checkbox06').prop('checked', mutedArray[5]);
  $('#checkbox07').prop('checked', mutedArray[6]);
  $('#checkbox08').prop('checked', mutedArray[7]);
  $('#checkbox09').prop('checked', mutedArray[8]);
  $('#checkbox10').prop('checked', mutedArray[9]);
  $('#checkbox11').prop('checked', mutedArray[10]);
  $('#checkbox12').prop('checked', mutedArray[11]);
  $('#checkbox13').prop('checked', mutedArray[12]);
  $('#checkbox14').prop('checked', mutedArray[13]);
  $('#checkbox15').prop('checked', mutedArray[14]);
  $('#checkbox016').prop('checked', mutedArray[15]);
});





socket.on('activeUsers', function (users){
  $("ul").html('')

  $.each(users , function(index, value){
        //console.log(index + ':' + value.username);
        $('#activeUsersDisplay').append('<li style="color:'+value.color+'">'+value.username +'</li>');
      });

});

//=============== AUDIO AREA =====================//

var audioContext = new AudioContext();

var playKey = function (data) {
      $('#' + data.id);// Passes button id
    }

//SEQUENCER
  // Use this array to store the values of all the sliders.
  //Sequence is based on number of values in array, which is based on number of itmes in seq div
  var values = [0, 2, 4, 5, 7, 9, 11, 12, 11, 9, 7, 5, 4, 2, 0, 7];

  // grab the sliders from the DOM and bind a `change` event.
  var $sliders = $('.slider');
  $sliders.on('change', function(e) {
    // if the slider changes, store its new value in the appropriate index of the `values` array.
    values[ $(this).index() ] = $(this).val();
    socket.emit('seqSliders', values);
  });



  var mutedArray = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
  var $mutes = $('.muteBox:checkbox');
  $mutes.on('change', function(e) {
    // if the mute changes, store its new value in the appropriate index of the `mutes` array.
    mutedArray[ $(this).index() ] = $(this).is(':checked');
    socket.emit('mutedArrayBroadcast', mutedArray);
  });


  // the checkbox will control the start & stop of the sequencer.
  $('.checkbox').on('change', function(e) {

    var seqOnOff;

    if( this.checked ) {
      // start the sequencer
      seqOnOff = true;
      nextNoteTime = audioContext.currentTime;
      scheduleSequence();
      intervalId = setInterval(scheduleSequence, intervalTime);
    } else {
      // stop the sequencer
      seqOnOff = false;
      intervalId = clearInterval(intervalId);
    }
    socket.emit('seqOnOff', seqOnOff);
  });

//=============== TIMING AREA =====================//

  var bpm          = 240; //NOT BPM!
  // an sixteenth note at the given bpm
  var noteLength   = bpm / 60 * (1/8);
  var attack       = 1/64;

  var lookahead    = 0.04; // 40ms expressed in seconds
  var intervalTime = 25;   // 25ms expressed in milliseconds

  // these will keep track of the state of the sequencer:
  // when the next note is happening
  var nextNoteTime = null;
  // the index of the current note from 0 - 15
  var currentNote  = 0;
  // the id of the setInterval lookahead
  var intervalId   = null;

      function scheduleSequence() {
        while(nextNoteTime < audioContext.currentTime + lookahead) {
      // schedule the next note
      scheduleNote( values[currentNote], nextNoteTime, currentNote, mutedArray[currentNote] );
      // advance the time
      nextNoteTime += noteLength;
      // keep track of which note we're on
      currentNote = ++currentNote % values.length;
    }
  }


//TODO: ALL MUTE, GLIDE, FILTER MOVEMENT, REVERB
  function scheduleNote(note, time, current, mute) {
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



    var baseOctave = document.getElementById('baseOctave');
    var baseOctaveDisplay = document.getElementById('baseOctaveDisplay');

    baseOctave.oninput = function () {
        baseOctaveDisplay.innerHTML = baseOctave.value - 1;
        socket.emit('baseOctaveBroadcast', baseOctave.value)
    };

    var basePitch = document.getElementById('basePitch');
    var basePitchDisplay = document.getElementById('basePitchDisplay');

    //Convert Int to Text for Display
    var serial = [ 'C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B', 'C']

    basePitch.oninput = function () {
        basePitchDisplay.innerHTML = serial[basePitch.value];
        socket.emit('basePitchBroadcast', basePitch.value)
    };

    var filter01 = document.getElementById('filter01');
    var filter01Display = document.getElementById('filter01Display');

    filter01.oninput = function () {
        filter01Display.innerHTML = filter01.value;
        socket.emit('filterBroadcast', filter01.value)
    };

//DELAY
    var delayTime = document.getElementById('delayTime');
    var delayTimeDisplay = document.getElementById('delayTimeDisplay');

    delayTime.oninput = function () {
        delayTimeDisplay.innerHTML = delayTime.value;
        socket.emit('delayTimeBroadcast', delayTime.value)
    };

    var delayFeedback = document.getElementById('delayFeedback');
    var delayFeedbackDisplay = document.getElementById('delayFeedbackDisplay');

    delayFeedback.oninput = function () {
        delayFeedbackDisplay.innerHTML = delayFeedback.value;
        socket.emit('delayFeedbackBroadcast', delayFeedback.value)
    };

    var delayCutoff = document.getElementById('delayCutoff');
    var delayCutoffDisplay = document.getElementById('delayCutoffDisplay');

    delayCutoff.oninput = function () {
        delayCutoffDisplay.innerHTML = delayCutoff.value;
        socket.emit('delayCutoffBroadcast', delayCutoff.value)
    };



//============ VISUAL FOR TESTING ===================//
var canvas = document.getElementById("waveFormCanvas");
var canvasContext = canvas.getContext('2d');
var analyser = audioContext.createAnalyser();
analyser.fftSize = 2048;
var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);
canvasWidth = 200;
canvasHeigth = 100;
canvasContext.clearRect(0, 0, canvasWidth, canvasHeigth);

function draw() {
  drawVisual = requestAnimationFrame(draw);
  analyser.getByteTimeDomainData(dataArray);
  canvasContext.fillStyle = 'rgb(200, 200, 200)';
  canvasContext.fillRect(0, 0, canvasWidth, canvasHeigth);
  canvasContext.lineWidth = 2;
  canvasContext.strokeStyle = 'rgb(0, 0, 0)';
  canvasContext.beginPath();

  var sliceWidth = canvasWidth * 1.0 / bufferLength;
  var x = 0;

  for(var i = 0; i < bufferLength; i++) {
    var v = dataArray[i] / 128.0;
    var y = v * canvasHeigth/2;

    if(i === 0) {
      canvasContext.moveTo(x, y);
    } else {
      canvasContext.lineTo(x, y);
    }
    x += sliceWidth;
  }

  canvasContext.lineTo(canvas.width, canvas.height/2);
  canvasContext.stroke();
};

draw();

function mtof(note) {
  var octaveMultiplier = baseOctave.value;
  var octave = octaveMultiplier * 12;
  var pitchAdder = 69 - parseInt(basePitch.value);
  return ( Math.pow(2, (note-pitchAdder+octave) / 12) ) * 440.0;
}

$(document).on('mousemove', function(event){
  socket.emit('mouse_activity', {x: event.pageX, y: event.pageY})
});



socket.on('all_mouse_activity', function(data){
  if($('.pointer[session_id="'+data.session_id+'"]').length <= 0) {
    $('body').append('<div class="pointer" session_id="'+data.session_id+'"></div>')
  }

  var $pointer = $('.pointer[session_id="'+data.session_id+'"]');

$pointer.css('left', data.coords.x)
$pointer.css('top', data.coords.y)


});




}); //jQuery Wrap
