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
var clients_dict = {}
for (var i=0; i<=clients.length;i++) {
    clients_dict[clients[i]] = false;
}


io.on('connection', function(socket){
  console.log('a user connected');
  clients_dict[socket.id] = false;
  socket.on('disconnect', function(){
  console.log('user disconnected');
  });
  socket.on('chat message', function(msg){
    // var clients = io.sockets.clients();
    // for (var i=0; i<=clients.length; i++) {
    //     if (clients[i] in clients_dict) {
    //         continue;
    //     }
    //     else {
    //         clients_dict[clients[i]] = false;
    //     }
    console.log(clients)
    console.log('message: ' + msg);
    socket.broadcast.to(socket.id).emit('chat message', msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
