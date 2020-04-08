const express = require('express');
const nanoid = require('nanoid').customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 4);

var path = require('path');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 443;
const app = express()

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, '../client/build')));
      
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    console.log(path.join(__dirname, '../client/build', 'index.html'));
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));
const io = socketIO(server);

let client_to_room = {};
let room_to_clients = {};
function generateRoom() {
  return nanoid(4);
}

io.on('connection', (socket) => {
  console.log('client_to_room');
  console.log(client_to_room);
  console.log('room_to_clients');
  console.log(room_to_clients);
  console.log('Client connected %s', socket.id);
  socket.on('handleMove', function(data) {
    console.log('handleMove:');
    console.log(data);
    io.emit('declareMove', data);
  });
  socket.on('disconnect', () => console.log('Client disconnected'));

  socket.on('createGame', function(){
    console.log("[%s] wants to create a room", socket.id);
  
    var roomName = generateRoom();
    client_to_room[socket.id] = roomName;
    room_to_clients[roomName] = [socket.id];
    socket.join(roomName);

    socket.emit('roomCreated', roomName);
  });

});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
