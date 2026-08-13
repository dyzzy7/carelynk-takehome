const express = require('express');
const workersRouter = require('./controllers/workers');
const docsRouter = require('./controllers/docs');

const app = express();
app.use(express.json());

app.use('/api/workers', workersRouter);
app.use('/api/docs', docsRouter);

module.exports = app;