import mongoose from 'mongoose';

const projectDataSchema = new mongoose.Schema({
    startDate: Date,
    projectId: String,
    isMilestone: Boolean,
    subActivities: [String],
    status: String,
    contracts: Boolean  // true -> contracts if delay happens, false -> translates
});

const activitySchema = new mongoose.Schema({
    title: String,
    deadline: Date,
    isDone: Boolean,
    users: [String],
    description: String,
    projectData: {
        type: projectDataSchema,
        default: null, // not part of a project
    }
});

// model created from schema
const Activity = mongoose.model('Activity', activitySchema);

export default Activity;