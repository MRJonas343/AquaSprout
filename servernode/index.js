const { SerialPort } = require('serialport');
const { Server } = require('socket.io');
const { ReadlineParser } = require('@serialport/parser-readline');
const express = require('express');
const http = require('node:http');

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

const mysql = require('mysql2');


const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database : 'iotproject',
  password : '',
  port : 3306
});

app.use(express.static(__dirname)); 

io.on('connection', (socket) => {
  console.log('Socket conectado:', socket.id);

  socket.on('controlPump', (command) => {
    if (command === 'on') {
      mySerial.write('ON\n');
    } else if (command === 'off') {
      mySerial.write('OFF\n');
    }
  });
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
  console.log('Serial Port Abierto');
});

parser.on('data', (data) => {
  console.log('Humidity:', data.trim());
  io.emit('Humidity', data.trim());
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Los meses empiezan desde 0, por lo que se suma 1.
  const day = String(now.getDate()).padStart(2, '0');

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const formatedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  connection.query("INSERT INTO lecturas_sensores (id_sensor, valor, unidad, fecha_hora) values (?, ?, ?, ?);",
  [1, Number(data.trim()), "Generic", formatedDate]
);
});

mySerial.on('error', (error) => {
  console.log('Error:', error);
});

httpServer.listen(3000, () => {
  console.log('Server is running on port 3000');
});
