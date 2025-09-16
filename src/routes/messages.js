const express = require('express');
const router = express.Router();
const payloadValidator = require("../middleware/PayloadValidator");
const messageIdValidator = require("../middleware/MessageIdValidator");
const messageHandler = require("../messageHandling/MessageHandler");
const authenticator = require("../middleware/Authentication");

router.use(authenticator);

router.get('/', async function(req, res) {
  try {
    const messageResults = await messageHandler.readAllMessages();
    res.json(await messageResults.toArray());
  } catch (err) {
    console.error("Exception reading all messages", err);
    sendErrorResponse(500, null, res);
  }
});

router.get('/:messageId', messageIdValidator.validateMessageId, async function(req, res) {
  try {
    const messageCursor = await messageHandler.readSingleMessage(req.params.messageId); 
    let message = await messageCursor.limit(1).toArray();

    if (message[0]) {
      res.json(message[0]);
    } else {
      sendErrorResponse(404, req.params.messageId, res);
    }
  } catch (err) {
    console.error("Exception reading single message", err);
    sendErrorResponse(500, null, res);
  }
});

router.post('/', payloadValidator.validatePayload, async function(req, res) {
  try {
    const messageId = await messageHandler.createMessage(req.body.message, null);
    sendSuccessResponse(201, messageId, res, "Created");
  } catch (err) {
    console.error("Exception creating message", err);
    sendErrorResponse(500, null, res);
  }
});

router.patch('/:messageId', payloadValidator.validatePayload, messageIdValidator.validateMessageId, async function(req, res) {
  try {
    const updateResults = await messageHandler.updateMessage(req.body.message, req.params.messageId);

    if (updateResults.matchedCount === 0) {
      sendErrorResponse(404, req.params.messageId, res);
    } else {
      let responseMessage;

      if (updateResults.modifiedCount === 0) {
        responseMessage = "Update Skipped, no change detected";
      } else {
        responseMessage = "Updated";
      }
      sendSuccessResponse(200, req.params.messageId, res, responseMessage);
    }
  } catch (err) {
    console.error("Exception updating message", err);
    sendErrorResponse(500, null, res);
  }
});

router.delete('/:messageId', messageIdValidator.validateMessageId, async function(req, res) {
  try {
    const messagesRemoved = await messageHandler.deleteSingleMessage(req.params.messageId);

    if (messagesRemoved !== 1) {
      sendErrorResponse(404, req.params.messageId, res);
    } else {
      sendSuccessResponse(200, req.params.messageId, res, "Deleted");
    }
  } catch (err) {
    console.error("Exception deleting message", err);
    sendErrorResponse(500, null, res);
  }
});

function sendErrorResponse(statusCode, messageId, res) {
  res.statusCode = statusCode;
  let responsePayload = {}

  if (messageId !== null) {
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

  if (messageId !== null) {
    responsePayload.messageId = messageId
  }

  responsePayload.status = responseMessage;
  res.json(responsePayload);
}

module.exports = router;
