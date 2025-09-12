require("dotenv").config();
const express = require('express');
const logger = require('morgan');
const messagesRouter = require('./routes/messages');
const healthRouter = require('./routes/health');
const db = require("./database/database");
const port = 8180;
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/messages', messagesRouter);
app.use('/health', healthRouter);

startApp();

async function startApp() {
  //initializes the DB connection to ensure the first requests are performant.
  await db.connectToDB().catch(err => {
    //If the connection errors, log the error and exit. The app can't function without a DB connection.
    console.error("Database connection failed", err);
    process.exit(1);
  });

  app.listen(port, () => {
    console.log(`Messages app listening on port ${port}`);
  });
}

module.exports = app;
