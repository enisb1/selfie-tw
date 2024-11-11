import mongoose from 'mongoose';

// schema
const notificationSchema = new mongoose.Schema({
    sender: String,
    receiver: String,
    time: Date,
    read: Boolean,
    text: String
});

// model created from schema
const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;