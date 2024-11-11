import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    
    title: {
        type: String,
        required: true,
    },
    bodyNote: {
        type: String,
        required: false,
    },
    bodyTask: {
        type: Array,
        required: false,
    },
    category: {
        type: String,
        required: true,
    },
    format: {
        type: String,
        required: false,
    },
    access: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
}
); 

const Note = mongoose.model('Note', noteSchema);
export default Note;