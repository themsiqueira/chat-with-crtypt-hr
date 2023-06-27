const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('Novo cliente conectado');

  const publicKey = bigInt.randBetween(2, prime.minus(1));
  socket.emit('publicKey', publicKey.toString());

  socket.on('sharedKey', (publicKey) => {
    const { privateKey, sharedKey } = calculateSharedKey(publicKey);
    socket.privateKey = privateKey;
    socket.sharedKey = sharedKey;

    console.log(`Chave compartilhada gerada para o cliente ${socket.id}: ${sharedKey}`);
  });

  socket.on('message', (data) => {
    const { message, encryptionType } = data;
    let encryptedMessage;

    if (encryptionType === 'DH') {
      // Criptografe a mensagem usando a chave compartilhada DH
      encryptedMessage = encryptWithDH(message, socket.sharedKey);
    } else {
      // Criptografe a mensagem usando S-DES ou RC4 (sem DH)
      encryptedMessage = encryptWithoutDH(message, encryptionType);
    }

    // Envie a mensagem criptografada para todos os clientes conectados
    io.emit('message', { message: encryptedMessage, encryptionType });
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
