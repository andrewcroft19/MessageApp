
function validatePayload(req, res, next) {
    const ajvLib = require('ajv');
    const msgSchema = require("../schemas/message_schema.json");

    const ajv = new ajvLib(); 
    const validateMsg = ajv.compile(msgSchema);
    const valid = validateMsg(req.body);

    if (!valid) {
      return res.status(400).json({ errors: validateMsg.errors });
    }

    next();
}

module.exports = {validatePayload};