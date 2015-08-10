$(function() {

//=============== User Tracking=====================//
var username = prompt('What\'s your username?');// The visitor is asked for their username...
socket.emit('newUser', username); // It's sent with the signal "newUser"
socket.on('message', function (message) { // A log is displayed when the server sends us a "message"
  console.log('SERVER: ' + message);
})

socket.on('activeUsers', function (users){
  $("ul").html('')
  $.each(users , function(index, value){
    $('#activeUsersDisplay').append('<li style="color:'+value.color+'">'+value.username +'</li>');
  });
});

//=============== Mouse Tracking =====================//
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


//=============== SOCKET.EMIT =====================//
var baseOctave = document.getElementById('baseOctave');
var baseOctaveDisplay = document.getElementById('baseOctaveDisplay');

baseOctave.oninput = function () {
    baseOctaveDisplay.innerHTML = baseOctave.value - 1;
    socket.emit('baseOctaveBroadcast', baseOctave.value)
};

var basePitch = document.getElementById('basePitch');
var basePitchDisplay = document.getElementById('basePitchDisplay');

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


//=============== SOCKET.ON =====================//
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

socket.on('sequencerOnOff', function (data){
  $('.checkbox').prop('checked', data);
  if( $('.checkbox').is(':checked')) {
    nextNoteTime = audioContext.currentTime;
    scheduleSequence();
    intervalId = setInterval(scheduleSequence, intervalTime);
  } else {
    intervalId = clearInterval(intervalId);
  }
});

socket.on('sequencerPitchValues', function (data){
  values = data;
  $('#sequencer > input').each(function () {
    $(this).val(values[$(this).attr('data-id')]);
  })
});

socket.on('sequencerMuteBroadcast', function (data){
  mutedArray = data;
  $('#mutes > input').each(function () {
    $(this).prop('checked', mutedArray[$(this).attr('data-id')]);

  })
});



}); 
