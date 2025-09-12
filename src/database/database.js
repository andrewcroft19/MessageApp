const { MongoClient } = require("mongodb");
const dbUri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/?retryWrites=true&w=majority`;
const client = new MongoClient(dbUri);
let database;

//A singleton is used here to ensure that only one connection to the DB is opened.
async function connectToDB() {
  if (!database) {
    await client.connect();
    database = client.db(process.env.DB_NAME);
  }
  return database;
}

async function writeSingleRecordToDB(json, collectionName) {
  const connection = await connectToDB();
  const collection = connection.collection(collectionName);
  const result = await collection.insertOne(json);
  return result.insertedId;
}

async function deleteSingleRecordFromDB(queryJson, collectionName) {
  const connection = await connectToDB();
  const collection = connection.collection(collectionName);
  const result = await collection.deleteOne(queryJson);
  return result.deletedCount;
}

async function updateRecord(queryJson, updateJson, collectionName) {
  const connection = await connectToDB();
  const collection = connection.collection(collectionName);
  const result = await collection.updateOne(queryJson, updateJson);
  return result
}

async function readFromDB(queryJson, collectionName) {
  const connection = await connectToDB();
  const collection = connection.collection(collectionName);
  return await collection.find(queryJson);
}

module.exports = {writeSingleRecordToDB, deleteSingleRecordFromDB: deleteSingleRecordFromDB, readFromDB, updateRecord, connectToDB}