$(function() {

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

var $accents = $('.accentBox:checkbox');
$accents.on('change', function(e) {
  accentArray[ $(this).index() ] = $(this).is(':checked');
  socket.emit('sequencerAccentBroadcast', accentArray);
});

});