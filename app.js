var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});
io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('keyPress', function(data){
    console.log(data);
    socket.broadcast.emit('keyPressed', data);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
