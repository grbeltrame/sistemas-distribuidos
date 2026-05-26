const express = require('express');
const cors = require('cors');
const boardsRouter = require('./routes/boards');
const listsRouter = require('./routes/lists');
const cardsRouter = require('./routes/cards');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/boards', boardsRouter);
app.use('/api', listsRouter);
app.use('/api', cardsRouter);

module.exports = app;