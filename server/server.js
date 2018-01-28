var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

const port = 3000

app.get('/', function(req, res){
  res.sendFile(path.resolve(__dirname + '/../index.html'));
});

app.use('/', express.static(path.resolve(__dirname + '/../')));

var initalClients = io.sockets.clients();
var activeClients = {};
for (var i=0; i<initalClients.length; i++) {
    activeClients[initialClients[i]] = false;
}

var counter = 0;
var timed_message = "";

io.on('connection', function(socket){
  console.log('user with id '+ socket.id + ' connected');
  activeClients[socket.id] = false;
  socket.on('disconnect', function(socket){
      console.log('user with id '+ socket.id + ' connected');
      delete activeClients.socket.id;
      });
  socket.on('chat message', function(msg){
    console.log('message from user with id '+ socket.id + ' : ' + msg);
    selectedClient = randomClient(activeClients);
    activeClients[selectedClient] = true;
    socket.broadcast.to(selectedClient).emit('chat message', msg, 1);
    timed_message = msg;
});

  socket.on('heard', function(){
    console.log('heard by user with id '+ socket.id);
    socket.broadcast.to(socket.id).emit('chat message', msg, counter);
    counter += 1;

    // for (var id in activeClients) { // Broadcast message to all people who haven't received it yet.
    //     if (activeClients[id] == false) {
    //         io.to(id).emit('chat message', msg);
    //     }
    //     else {
    //         continue;
    //     }
    // };
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});

var randomClient = function (obj) {
    var keys = Object.keys(obj);
    return obj[keys[ keys.length * Math.random() << 0]];
};
