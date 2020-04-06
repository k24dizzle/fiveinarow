const express = require('express');
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


let clients = {};

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('handleMove', function(data) {
    console.log('handleMove:');
    console.log(data);
  });
  socket.on('disconnect', () => console.log('Client disconnected'));

});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
