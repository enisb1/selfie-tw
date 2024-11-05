import mongoose from 'mongoose';

// schema
const activitySchema = new mongoose.Schema({
    title: String,
    deadline: Date
});

// model created from schema
const Event = mongoose.model('Activity', activitySchema);

export default Event;