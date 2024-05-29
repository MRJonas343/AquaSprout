const { SerialPort } = require('serialport');
const { Server } = require('socket.io');
const { ReadlineParser } = require('@serialport/parser-readline');
const express = require('express');
const http = require('node:http');

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

app.use(express.static(__dirname)); 

io.on('connection', (socket) => {
  console.log('Socket conectado:', socket.id);
});

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

const mySerial = new SerialPort({
  path: 'COM8',
  baudRate: 9600
});

const parser = mySerial.pipe(new ReadlineParser());

mySerial.on('open', () => {
  console.log('Serial Port Aberto');
});

parser.on('data', (data) => {
  console.log('Humidity:', data.trim());
  io.emit('Humidity', data.trim());
});

mySerial.on('error', (error) => {
  console.log('Error:', error);
});

httpServer.listen(3000, () => {
  console.log('Server is running on port 3000');
});
