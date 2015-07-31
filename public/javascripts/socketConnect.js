var socket = io();

//=============== USER =======================//
// The visitor is asked for their username...
var username = prompt('What\'s your username?');
// It's sent with the signal "newUser"
socket.emit('newUser', username);
// A log is displayed when the server sends us a "message"
socket.on('message', function (message) {
    console.log('SERVER: ' + message);
})




//=============== AUDIO =======================//
var playKey = function (data) {
  $('#' + data.id)[data.action]('redBackground');
}




//local
socket.on('message', function(message) {
  console.log(message);
});

$('.key').mousedown(function () {
  var keyData = {
    id: $(this).attr('id'),
    action: 'addClass',
  }
  //playKey(keyData);
  socket.emit('keyPress', keyData);
});

$('.key').mouseup(function () {
  var keyData = {
    id: $(this).attr('id'),
    action: 'removeClass',
  }
  //playKey(keyData);
  socket.emit('keyPress', keyData);
});





//remote
socket.on('keyPressed', function(data){
  playKey(data);
  //console.log(data);

  if (data['id'] == 'key1') {
    playButton01();
  } else {
    playButton02();
  }

});

