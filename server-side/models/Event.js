import mongoose from 'mongoose';

// schema
const eventSchema = new mongoose.Schema({
    title: String,
    startDate: Date,
    endDate: Date,
    frequency: String,
    repetitionNumber: Number,
    repetitionDate: Date,
    color: String
});

// model created from schema
const Event = mongoose.model('Event', eventSchema);

export default Event;