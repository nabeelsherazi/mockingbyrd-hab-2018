var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

const port = 3000;

app.get('/', function(req, res) {
  res.sendFile(path.resolve(__dirname + '/public/index.html'));
  console.log("sent file at " + __dirname + '/public/index.html')
});

app.use(express.static(path.join(__dirname, "public")));

var initialClients = io.sockets.clients();
var activeClients = {};
for (var i = 0; i < initialClients.length; i++) {
  activeClients[initialClients[i]] = false;
}

var counter = 1;
var timed_message = "";

io.on('connection', function(socket) {
  console.log('user with id ' + socket.id + ' connected');
  activeClients[socket.id] = false;

  socket.on('disconnect', function() {
    console.log('user with id ' + socket.id + ' disconnected');
    delete activeClients[socket.id];
  });

  socket.on('chat message', function(msg) {
    console.log('message from user with id ' + socket.id + ' : ' + msg);
    selectedClient = randomClient(activeClients);
    while (selectedClient == socket.id) {
      if (Object.keys(activeClients).length == 1) { // Unless there's only one client
        break
      }
      else {
        selectedClient = randomClient(activeClients); // Keep pulling random clients until the socket that sent the message is not the one to recieve.
      }
    }
    console.log('selected random seed client is ' + selectedClient);
    activeClients[selectedClient] = true;
    socket.broadcast.to(selectedClient).emit('chat message', msg, 0);
    counter = 1;
    timed_message = msg;
  });

  socket.on('heard', function() {
    console.log('heard by user with id ' + socket.id);
    socket.broadcast.to(socket.id).emit('chat message', timed_msg, counter);
    counter += 1;
    io.emit('currentFreq', counter)
    setTimeout(sendToAllRemainingClients(), 10000)

  });

});

var randomClient = function(clientListObject) {
  var keys = Object.keys(clientListObject);
  return keys[Math.floor(keys.length * Math.random() )];
};

var sendToAllRemainingClients = function() {
  for (var id in activeClients) { // Broadcast message to all people who haven't received it yet.
    if (activeClients[id] == false) {
      io.to(id).emit('chat message', timed_message);
      activeClients[id] = true;
    } else {
      continue;
    }
  }
  ;
}

http.listen(port, function() {
  console.log('listening on *:' + port);
});
