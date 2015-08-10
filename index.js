var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	
  	// When the client connects, they are sent a message
  	socket.emit('message', "You are connected!");// Current user

  	// The other clients are told that someone new has arrived
    socket.broadcast.emit('message', 'Another user has just connected!');// All users

  	// As soon as the username is received, it's stored as a session variable
  	socket.on('newUser', function(username) {

      var users = [];
      var color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);

      socket.username = username;
      socket.color = color;

      io.sockets.sockets.forEach (function (e) {
          users.push ({username: e.username, color: e.color});
      });
      
      console.log (users);
      socket.emit('activeUsers', users); // Current user
      socket.broadcast.emit('activeUsers', users); // All users
  	});




    socket.on('mouse_activity', function (data) {
      //console.log(data);
      //socket.broadcast.emit('all_mouse_activity', data);// All users
      socket.broadcast.emit('all_mouse_activity', {session_id: socket.id, coords: data});

    });



	// When a "message" is received, it's logged in the console
    socket.on('message', function (message) {
        console.log(socket.username + ': ' + message);
    });

  // When a "keyPress" is received, it's broadcast to all
  	socket.on('keyPress', function (data){
      socket.emit('keyPressed', data);// Current user
    	socket.broadcast.emit('keyPressed', data);// All users
  	});

    // When a "baseOctaveBroadcast" is received, it's broadcast to all
    socket.on('baseOctaveBroadcast', function (data){
      //socket.emit('baseOctaveBroadcast', data);// Current user
      socket.broadcast.emit('baseOctaveBroadcast', data);// All users
    });

  // When a "basePitchBroadcast" is received, it's broadcast to all
  	socket.on('basePitchBroadcast', function (data){
      //socket.emit('basePitchBroadcast', data);// Current user
    	socket.broadcast.emit('basePitchBroadcast', data);// All users
  	});

    // When a "filterBroadcast" is received, it's broadcast to all
    socket.on('filterBroadcast', function (data){
      //socket.emit('basePitchBroadcast', data);// Current user
      socket.broadcast.emit('filterBroadcast', data);// All users
    });



    // When a "filterBroadcast" is received, it's broadcast to all
    socket.on('delayTimeBroadcast', function (data){
      //socket.emit('basePitchBroadcast', data);// Current user
      socket.broadcast.emit('delayTimeBroadcast', data);// All users
    });
    // When a "filterBroadcast" is received, it's broadcast to all
    socket.on('delayFeedbackBroadcast', function (data){
      //socket.emit('basePitchBroadcast', data);// Current user
      socket.broadcast.emit('delayFeedbackBroadcast', data);// All users
    });
    // When a "filterBroadcast" is received, it's broadcast to all
    socket.on('delayCutoffBroadcast', function (data){
      //socket.emit('basePitchBroadcast', data);// Current user
      socket.broadcast.emit('delayCutoffBroadcast', data);// All users
    });






    socket.on('seqOnOff', function (data){
      //socket.emit('seqOnOff', data);// NOT for Current user
      socket.broadcast.emit('seqOnOff', data);// All users
    });

    socket.on('mutedArrayBroadcast', function (data){
      //socket.emit('mutedArrayBroadcast', data);// NOT for Current user
      socket.broadcast.emit('mutedArrayBroadcast', data);// All users
    });

    socket.on('seqSliders', function (data){
      //socket.emit('seqSliders', data);// NOT for Current user
      socket.broadcast.emit('seqSliders', data);// All users
    });


});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

