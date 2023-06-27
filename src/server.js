const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const bigInt = require("big-integer");
const { prime } = require('./constants/dh');

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('Novo cliente conectado', { id: socket.id });
  const publicKey = bigInt.randBetween(2, prime.minus(1));
  socket.emit('publicKey', publicKey.toString());

  socket.on('sharedKey', (publicKey) => {
    const { privateKey, sharedKey } = calculateSharedKey(publicKey);
    socket.privateKey = privateKey;
    socket.sharedKey = sharedKey;

    console.log(`Chave compartilhada gerada para o cliente ${socket.id}: ${sharedKey}`);
  });

  socket.on('message', (data) => {
    console.log('message', data);
    const { message, encryptionType, userId } = data;
    io.emit('message', { message, encryptionType, userId });
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
