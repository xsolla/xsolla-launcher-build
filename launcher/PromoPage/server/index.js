const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = new express();

app.use(bodyParser.json({limit: '20mb'}));
app.use(express.static(path.resolve(__dirname, '../build')));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
});

module.exports = app;