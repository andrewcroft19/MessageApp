const express = require('express');
const router = express.Router();
const payloadValidator = require("../middleware/PayloadValidator");
const messageIdValidator = require("../middleware/MessageIdValidator");
const messageHandler = require("../messageHandling/MessageHandler");

router.get('/', async function(req, res) {
  const messageResults = await messageHandler.readAllMessages();

  if (messageResults) {
    streamResults(res, messageResults);
  } else {
    sendErrorResponse(500, null, res);
  }
});

router.get('/:messageId', messageIdValidator.validateMessageId, async function(req, res) {
  const messageCursor = await messageHandler.readSingleMessage(req.params.messageId);

  if (!messageCursor) {
    sendErrorResponse(500, null, res);
  }

  var message = await messageCursor.limit(1).toArray();

  if (message[0]) {
    res.json(message[0]);
  } else {
    sendErrorResponse(400, req.params.messageId, res);
  }
});

router.post('/', payloadValidator.validatePayload, async function(req, res) {
  const messageId = await messageHandler.createMessage(req.body.message, null);
  
  if  (messageId) {
    sendSuccessResponse(201, messageId, res, "Created")
  } else {
    sendErrorResponse(500, null, res);
  }
});

router.patch('/:messageId', payloadValidator.validatePayload, messageIdValidator.validateMessageId, async function(req, res) {
    const updateResults = await messageHandler.updateMessage(req.body.message, req.params.messageId);

    if (!updateResults) {
      sendErrorResponse(500, null, res);
    } else if (updateResults.matchedCount === 0) {
      sendErrorResponse(400, req.params.messageId, res);
    } else {
      let responseMessage;

      if (updateResults.modifiedCount == 0) {
        responseMessage = "Update Skipped, no change detected"
      } else {
        responseMessage = "Updated"
      }
      sendSuccessResponse(200, req.params.messageId, res, responseMessage);
    }
});

router.delete('/:messageId', messageIdValidator.validateMessageId, async function(req, res) {
  const messagesRemoved = await messageHandler.deleteSingleMessage(req.params.messageId);

  if (messagesRemoved != 1) {
    if (messagesRemoved === null) {
      sendErrorResponse(500, null, res);
    } else if (messagesRemoved < 1) {
      sendErrorResponse(400, req.params.messageId, res);
    } 
  } else {
    sendSuccessResponse(200, req.params.messageId, res, "Deleted");
  }
});

async function streamResults(res, messageResults) {
  res.setHeader("Content-Type", "application/json");
  res.write('{ "messages": [');
  let first = true;

  for await (const message of messageResults) {
      if (!first) res.write(",");
      res.write(JSON.stringify(message));
      first = false;
  }

  res.write("]}");
  res.end();
}

function sendErrorResponse(statusCode, messageId, res) {
  res.statusCode = statusCode;
  let responsePayload = {}

  if (messageId != null) {
    responsePayload.messageId = messageId
  }

  if (statusCode === 400) {
    responsePayload.error = "Message Not Found";
  } else {
    responsePayload.error = "Internal Server Error";
  }
  res.json(responsePayload);
}

function sendSuccessResponse(statusCode, messageId, res, responseMessage) {
  res.statusCode = statusCode;
  let responsePayload = {};

  if (messageId != null) {
    responsePayload.messageId = messageId
  }

  responsePayload.status = responseMessage;
  res.json(responsePayload);
}

module.exports = router;
