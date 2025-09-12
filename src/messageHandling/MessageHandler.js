const database = require("../database/database");
const { ObjectId } = require("mongodb");
const collectionName = process.env.MESSAGES_COLLECTION_NAME

async function createMessage(message, messageId) {
    let createdMessageId;
    
    if (messageId) {
        createdMessageId = await database.writeSingleRecordToDB({_id : new ObjectId(messageId), message : message, isPalindrome : isPalindrome(message)}, collectionName);
    } else {
        createdMessageId = await database.writeSingleRecordToDB({message : message, isPalindrome : isPalindrome(message)}, collectionName);
    }

    return createdMessageId;
}

async function deleteSingleMessage(messageId) {
    const messagesDeleted = await database.deleteSingleRecordFromDB({_id : new ObjectId(messageId)}, collectionName);
    
    return messagesDeleted;
}

async function readAllMessages() {
    const messageResults = await database.readFromDB({}, collectionName);
    
    return messageResults;
}

async function readSingleMessage(messageId) {
    const messageResults = await database.readFromDB({_id : new ObjectId(messageId)}, collectionName);
    
    return messageResults
}

async function updateMessage(message, messageId) {
    const updateMessageResult = await database.updateRecord({_id : new ObjectId(messageId)}, {$set: {message : message, isPalindrome : isPalindrome(message)}}, collectionName);
    
    return updateMessageResult
}

function isPalindrome(message) {

    if (message.length <= 1) {
        return false
    }
    
    let maxIndex = message.length/2 + 1;
    let lastStringIndex = message.length - 1;
    
    for (let i = 0; i < maxIndex; i++) {
        let currentChar = message.charAt(i);
        let inverseIndex = lastStringIndex - i;
        let inverseChar = message.charAt(inverseIndex);
    
        if (i === inverseIndex) {
            break
        }
    
        if (currentChar != inverseChar) {
            return false
        }
    }
    return true;
}

module.exports = {createMessage, deleteSingleMessage: deleteSingleMessage, readAllMessages, readSingleMessage, updateMessage, isPalindrome}
