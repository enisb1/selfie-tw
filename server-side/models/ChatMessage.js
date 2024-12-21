import mongoose from 'mongoose';

// schema
const chatMessageSchema = new mongoose.Schema({
    sender: String,
    time: Date,
    message: String
});

// model created from schema
const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

export default ChatMessage;