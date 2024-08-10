const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    sender: { type: String, required: true }, // 'user' or 'bot'
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const sessionSchema = new Schema({
    messages: [messageSchema],
    createdAt: { type: Date, default: Date.now }
});

const chatHistorySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sessions: [sessionSchema] // Store each chat session separately
});

module.exports = mongoose.model('ChatHistory', chatHistorySchema);
