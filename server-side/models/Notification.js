import mongoose from 'mongoose';

// schema
const notificationSchema = new mongoose.Schema({
    sender: String,
    receiver: String,
    time: Date,
    read: Boolean,
    title: String,
    text: String,
    type: String,
    data: Object
});

// model created from schema
const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;