import mongoose from 'mongoose';

// schema
const activitySchema = new mongoose.Schema({
    title: String,
    deadline: Date,
    isDone: Boolean,
    users: [String]
});

// model created from schema
const Activity = mongoose.model('Activity', activitySchema);

export default Activity;