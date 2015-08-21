$(function() {

//=============== User Tracking=====================//
var username = prompt('What\'s your username?');
socket.emit('newUser', username);

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


//=============== Waveform Selection Sent To Server =====================//
$('.key').click(function () {
  var keyData = {
    id: $(this).attr('id')
  }
  socket.emit('keyPress', keyData);
});


//============= Delay Notifications Sent to Server =====================//
var $delays = $('.delay');
$delays.on('change', function(e) {
    var delayData = {
    time: delayTime.value,
    feedback: delayFeedback.value,
    cutoff: delayCutoff.value
    };
  socket.emit('delayNotification', delayData);
});


//============= Pitch Notifications Sent to Server =====================//
var $pitchmods = $('.pitchmod');
$pitchmods.on('change', function(e) {
    var pitchData = {
    octave: baseOctave.value,
    base: basePitch.value,
    filter: filter01.value
    };
  socket.emit('pitchNotification', pitchData);
});


//============= Sequencer Notifications Sent to Server =====================//
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
  pitchesArray = data;
  $('#sequencer > input').each(function () {
    $(this).val(pitchesArray[$(this).attr('data-id')]);
  })
});

socket.on('sequencerMuteBroadcast', function (data){
  mutedArray = data;
  $('#mutes > input').each(function () {
    $(this).prop('checked', mutedArray[$(this).attr('data-id')]);

  })
});

socket.on('sequencerAccentBroadcast', function (data){
  accentArray = data;
  $('#accents > input').each(function () {
    $(this).prop('checked', accentArray[$(this).attr('data-id')]);

  })
});


}); 
