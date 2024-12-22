import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name: String,
    description: String,
    start: Date,
    end: Date,
    owner: String,
    members: [String],
    activities: [String]    // contains ids of both activities and sets of activities
});

const Project = mongoose.model('Project', projectSchema);

export default Project;