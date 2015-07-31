$(function() {

    var socket = io();

//=============== USER =====================//
    var username = prompt('What\'s your username?');// The visitor is asked for their username...
    socket.emit('newUser', username); // It's sent with the signal "newUser"
    socket.on('message', function (message) { // A log is displayed when the server sends us a "message"
        console.log('SERVER: ' + message);
    })

//=============== POKE FOR TESTING CONNECTION ====================//
        $('#poke').click(function () {
            socket.emit('message', 'Hi server, how are you?');
        })

//=============== AUDIO =====================//
    var playKey = function (data) {
      $('#' + data.id);// Passes button id
    }

//=============== EMIT = SUBMIT =====================//
    $('.key').click(function () {
      var keyData = {
        id: $(this).attr('id')
      }
      //playKey(keyData);
      socket.emit('keyPress', keyData);
    });

//=============== ON = LISTEN =====================//
    socket.on('keyPressed', function(data){
      playKey(data);
      console.log(data);

    switch (data['id']) {
        case '0':
            playButton01();
            break;
        case '1':
            playButton02();
            break;
        case '2':
            playButton03();
            break;
        case '3':
            playButton04();
            break;
        };
    });

}); //Wrap
