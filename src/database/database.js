const crypto = require('crypto');
const { MongoClient } = require("mongodb");
const dbUri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/?retryWrites=true&w=majority`;
const client = new MongoClient(dbUri);
let database;

async function connectToDB() {
  if (!database) {
    await client.connect();
    database = client.db(process.env.DB_NAME);
  }
  return database;
}

async function writeSingleRecordToDB(json, collectionName) {
  try {
    const connection = await connectToDB();
    const collection = connection.collection(collectionName);
    const result = await collection.insertOne(json);
    return result.insertedId;
  } catch (exception) {
    console.error("Exception writing to DB", exception);
    return null;
  }
}

async function deleteOneRecordFromDB(queryJson, collectionName) {
  try {
    const connection = await connectToDB();
    const collection = connection.collection(collectionName);
    const result = await collection.deleteOne(queryJson);
    return result.deletedCount;
  } catch (exception) {
    console.error("Exception deleting from DB", exception);
    return null;
  }
}

async function updateRecord(queryJson, updateJson, collectionName) {
  try {
    const connection = await connectToDB();
    const collection = connection.collection(collectionName);
    const result = await collection.updateOne(queryJson, updateJson);
    return result
  } catch (exception) {
    console.error("Exception updating DB", exception);
    return null;
  }
}

async function readFromDB(queryJson, collectionName) {
  try {
    const connection = await connectToDB();
    const collection = connection.collection(collectionName);
    return await collection.find(queryJson);
  } catch (exception) {
    console.error("Exception reading from DB", exception);
    return null;
  }
}

module.exports = {writeSingleRecordToDB, deleteOneRecordFromDB, readFromDB, updateRecord, connectToDB}