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
      socket.broadcast.emit('all_mouse_activity', {session_id: socket.id, coords: data});

    });

    socket.on('message', function (message) {
        console.log(socket.username + ': ' + message);
    });

  	socket.on('keyPress', function (data){
      socket.emit('keyPressed', data);// Current user
    	socket.broadcast.emit('keyPressed', data);// All users
  	});





//DELAY NOTIFICATIONS RECIEVED(app.js) AND BROADCAST(synth.js)
    socket.on('delayNotification', function (data){
      socket.emit('delayNotification', data);// Current user
      socket.broadcast.emit('delayNotification', data);// All users
    });


//PITCH NOTIFICATIONS RECIEVED(app.js) AND BROADCAST(synth.js)
    socket.on('pitchNotification', function (data){
      socket.emit('pitchNotification', data);// Current user
      socket.broadcast.emit('pitchNotification', data);// All users
    });




    socket.on('sequencerOnOff', function (data){
      //socket.emit('sequencerOnOff', data);//Current user
      socket.broadcast.emit('sequencerOnOff', data);// All users
    });

    socket.on('sequencerPitchValues', function (data){
      //socket.emit('sequencerPitchValues', data);//Current user
      socket.broadcast.emit('sequencerPitchValues', data);// All users
    });

    socket.on('sequencerMuteBroadcast', function (data){
      //socket.emit('sequencerMuteBroadcast', data);//Current user
      socket.broadcast.emit('sequencerMuteBroadcast', data);// All users
    });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

