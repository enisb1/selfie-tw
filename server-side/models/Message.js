import mongoose from 'mongoose';

// schema
const messageSchema = new mongoose.Schema({
    sender: String,
    receiver: String,
    time: Date,
    read: Boolean,
    text: String
});

// model created from schema
const Message = mongoose.model('Message', messageSchema);

export default Message;