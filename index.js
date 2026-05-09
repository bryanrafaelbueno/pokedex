const express = require('express');
const path = require('path');
const app = express();

const port = process.env.PORT || 8080;

// Cache durations
const CACHE_LONG = 'public, max-age=31536000, immutable'; // 1 year (fonts, images, audio)
const CACHE_SHORT = 'public, max-age=604800';              // 7 days (CSS, JS)
const NO_CACHE = 'no-cache';                               // Always revalidate (HTML)

app.get('/', (req, res) => {
    res.set('Cache-Control', NO_CACHE);
    res.sendFile(path.join(__dirname, 'ClientContent/index.html'));
});

app.get('/index.js', (req, res) => {
    res.set('Cache-Control', CACHE_SHORT);
    res.sendFile(path.join(__dirname, 'ClientContent/index.js'));
});

app.get('/index.css', (req, res) => {
    res.set('Cache-Control', CACHE_SHORT);
    res.sendFile(path.join(__dirname, 'ClientContent/index.css'));
});

app.get('/fonts/8-BIT%20WONDER.ttf', (req, res) => {
    res.set('Cache-Control', CACHE_LONG);
    res.sendFile(path.join(__dirname, 'ClientContent/fonts/8-BIT WONDER.ttf'));
});

app.get('/assets/pokedex.webp', (req, res) => {
    res.set('Cache-Control', CACHE_LONG);
    res.sendFile(path.join(__dirname, 'ClientContent/assets/pokedex.webp'));
});

app.get('/404.css', (req, res) => {
    res.set('Cache-Control', CACHE_SHORT);
    res.sendFile(path.join(__dirname, 'ClientContent/404/404.css'));
});

app.get('/404.mp3', (req, res) => {
    res.set('Cache-Control', CACHE_LONG);
    res.sendFile(path.join(__dirname, 'ClientContent/404/404.mp3'));
});

app.use((req, res) => {
    res.status(404).sendFile(`${__dirname}/ClientContent/404/404.html`);
});

app.listen(port, () => {
    console.log('Entre em: http://localhost:8080');
});