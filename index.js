const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 8080;

// só conecta socket (sem API)
io.on('connection', (socket) => {
    console.log(`a ${socket.id} connected`);
});

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/ClientContent/index.html`);
});

app.get('/index.js', (req, res) => {
    res.sendFile(`${__dirname}/ClientContent/index.js`);
});

app.get('/index.css', (req, res) => {
    res.sendFile(`${__dirname}/ClientContent/index.css`);
});

app.get('/fonts/8-BIT%20WONDER.ttf', (req, res) => {
    res.sendFile(`${__dirname}/ClientContent/fonts/8-BIT WONDER.ttf`);
});

app.use('/404.css', (req, res) => {
    res.status(404).sendFile(`${__dirname}/ClientContent/404/404.css`);
});

app.use((req, res) => {
    res.status(404).sendFile(`${__dirname}/ClientContent/404/404.html`);
});

server.listen(port, () => {
    console.log('Entre em: http://localhost:8080');
});