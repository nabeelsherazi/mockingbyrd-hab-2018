var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

app.get('/', function(req, res){
  res.sendFile(path.resolve(__dirname + '/../index.html'));
});

app.use('/', express.static(path.resolve(__dirname + '/../')));

var clients = io.sockets.clients();

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
  console.log('user disconnected');
  });
  socket.on('chat message', function(msg){
    var clients = io.sockets.clients();
    console.log(clients)
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
