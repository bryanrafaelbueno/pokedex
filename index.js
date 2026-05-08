const express = require('express');
const app = express();

const port = process.env.PORT || 8080;

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

app.get('/404.css', (req, res) => {
    res.sendFile(`${__dirname}/ClientContent/404/404.css`);
});
app.get('/404.mp3', (req, res) => {
    res.sendFile(`${__dirname}/ClientContent/404/404.mp3`);
});

app.use((req, res) => {
    res.status(404).sendFile(`${__dirname}/ClientContent/404/404.html`);
});

app.listen(port, () => {
    console.log('Entre em: http://localhost:8080');
});