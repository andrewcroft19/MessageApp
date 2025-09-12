const { ObjectId } = require("mongodb");

//This middleware validates that the messageId provided in the URL path is a valid MongoDB ObjectId.
//If the messageId is not valid, a 400 response is sent back to the client.
//This ensures we fail fast if the messageId format is incorrect, avoiding unnecessary DB queries.
function validateMessageId(req, res, next) {
    if (!ObjectId.isValid(req.params.messageId)) {
        return res.status(400).json({messageId : req.params.messageId, error: "Invalid messageId format"});
    }

    next();
}

module.exports = {validateMessageId};