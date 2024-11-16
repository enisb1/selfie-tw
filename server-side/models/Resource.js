import mongoose from 'mongoose';

// schema
const resourceSchema = new mongoose.Schema({
    name: String
});

// model created from schema
const Resource = mongoose.model('Resource', resourceSchema);

export default Resource;