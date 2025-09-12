const express = require('express');
const router = express.Router();
const database = require("../database/database");

router.get('/', async function(req, res) {
    const collectionName = process.env.HEALTH_COLLECTION_NAME;
    const probe = { _id: "healthcheck-probe", ts: new Date() };
    const dbWrite = await database.writeSingleRecordToDB(probe, collectionName);
    const dbWritePassed = dbWrite != null;

    const dbRead = await database.readFromDB({_id : probe._id}, collectionName);
    const results = await dbRead.toArray();
    const dbReadPassed = results != null;

    const dbDelete = await database.deleteOneRecordFromDB({_id : probe._id}, collectionName);
    const dbDeletePassed = dbDelete != null;
  
    if (dbWritePassed && dbReadPassed && dbDeletePassed) {
        res.statusCode = 200;
    } else {
        res.statusCode = 500;
    }

    res.json({dbWritePassed: dbWritePassed, dbReadPassed: dbReadPassed, dbDeletePassed: dbDeletePassed});
});

module.exports = router;