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

    if (createdMessageId) {
        return createdMessageId;
    }

    return null;
}

async function deleteSingleMessage(messageId) {
    const messagesDeleted = await database.deleteOneRecordFromDB({_id : new ObjectId(messageId)}, collectionName);
    
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
    
    const maxIndex = message.length/2 + 1;
    const lastStringIndex = message.length - 1;
    
    for (let i = 0; i < maxIndex; i++) {
        const currentChar = message.charAt(i);
        const inverseIndex = lastStringIndex - i;
        const inverseChar = message.charAt(inverseIndex);
    
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
