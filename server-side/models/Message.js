import mongoose from 'mongoose';

// schema
const messageSchema = new mongoose.Schema({
    sender: Number,
    receiver: Number,
    time: Date,
    read: Boolean,
    text: String
});

// model created from schema
const Message = mongoose.model('Message', messageSchema);

export default Message;