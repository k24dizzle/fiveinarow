const express = require('express');
const nanoid = require('nanoid').customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 4);

var path = require('path');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 443;
const app = express()

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "fiverow.herokuapp.com"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
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
    console.log("[createGame] %s wants to create a room", socket.id);
  
    var roomName = generateRoom();
    client_to_room[socket.id] = roomName;
    room_to_clients[roomName] = [socket.id];
    socket.join(roomName);

    socket.emit('roomCreated', roomName);
  });

  socket.on('joinRoom', function(roomName){
    console.log("[joinRoom] %s wants to join %s", socket.id, roomName);
    // When a player joins a room
    if (roomName in room_to_clients) {
      var room = room_to_clients[roomName];
      if (room.length < 2 && !room.includes(socket.id)) {
        socket.join(roomName);
        room_to_clients[roomName].push(socket.id);
        client_to_room[socket.id] = roomName;
      
        io.to(roomName).emit('roomUpdated', {
          clients: room_to_clients[roomName],
          roomName: roomName,
        });
      } else if (room.includes(socket.id)) {
        socket.join(roomName);

        io.to(roomName).emit('roomUpdated', {
          clients: room_to_clients[roomName],
          roomName: roomName,
        });
      } else {
        socket.emit('roomDenied', roomName);
      }
    } else {
      console.log("%s tried to join non-room %s", socket.id, roomName);
      socket.emit('roomDenied', roomName);
    }
  })

});
