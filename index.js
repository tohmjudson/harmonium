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
	socket.emit('message', "You are connected!");
	// The other clients are told that someone new has arrived
    socket.broadcast.emit('message', 'Another user has just connected!');

	// As soon as the username is received, it's stored as a session variable
	socket.on('newUser', function(username) {
	    socket.username = username;
	});

	// When a "message" is received (click on the button), it's logged in the console
    socket.on('message', function (message) {
        // The username of the person who clicked is retrieved from the session variables
        console.log(socket.username + ': ' + message);
    }); 
  
  	socket.on('keyPress', function(data){
    	//console.log(data);
    	socket.broadcast.emit('keyPressed', data);
  	});

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

