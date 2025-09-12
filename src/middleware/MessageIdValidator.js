const { ObjectId } = require("mongodb");

function validateMessageId(req, res, next) {
    if (!ObjectId.isValid(req.params.messageId)) {
        return res.status(400).send("Invalid Message ID");
    }

    next();
}

module.exports = {validateMessageId};