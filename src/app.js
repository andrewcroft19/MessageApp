require("dotenv").config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const messagesRouter = require('./routes/messages');
const healthRouter = require('./routes/health');
const db = require("./database/database");
const port = 8080;
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/messages', messagesRouter);
app.use('/health', healthRouter);

startApp();

async function startApp() {
  await db.connectToDB().catch(err => {console.error("Database connection failed", err)});

    app.listen(port, () => {
    console.log(`Messages app listening on port ${port}`);
  });
}

module.exports = app;
