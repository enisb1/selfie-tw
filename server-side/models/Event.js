import mongoose from 'mongoose';

// schema
const eventSchema = new mongoose.Schema({
    title: String,
    location: String,
    startDate: Date,
    endDate: Date,
    frequency: String,
    repetitionNumber: Number,
    repetitionDate: Date,
    color: String,
    users: [String],
    resources: [String],
    notify15Before: Boolean,
    notify30Before: Boolean,
    notify1HourBefore: Boolean,
    notify1DayBefore: Boolean,
    pomodoroSettings: {
        minStudy: Number,
        minRelax: Number,
        cycles: Number
    }
});

// model created from schema
const Event = mongoose.model('Event', eventSchema);

export default Event;