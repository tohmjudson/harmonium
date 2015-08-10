$(function() {

$('.checkbox').on('change', function(e) {
  var sequencerOnOff;
  if( this.checked ) {
    sequencerOnOff = true;
    nextNoteTime = audioContext.currentTime;
    scheduleSequence();
    intervalId = setInterval(scheduleSequence, intervalTime);
  } else {
    sequencerOnOff = false;
    intervalId = clearInterval(intervalId);
  }
  socket.emit('sequencerOnOff', sequencerOnOff);
});

var $sliders = $('.slider');
$sliders.on('change', function(e) {
  values[ $(this).index() ] = $(this).val();
  socket.emit('sequencerPitchValues', values);
});


var $mutes = $('.muteBox:checkbox');
$mutes.on('change', function(e) {
  mutedArray[ $(this).index() ] = $(this).is(':checked');
  socket.emit('sequencerMuteBroadcast', mutedArray);
});

scheduleSequence =  function() {
  while(nextNoteTime < audioContext.currentTime + lookahead) {
    // schedule the next note
    scheduleNote( values[currentNote], nextNoteTime, currentNote, mutedArray[currentNote] );
    // advance the time
    nextNoteTime += noteLength;
    // keep track of which note we're on
    currentNote = ++currentNote % values.length;
  }
}

});