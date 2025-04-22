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
    },
    user: {
        type: String,
        required: false,
    },
    userListAccess: {
        type: Array,
        required: false,
    },
}, {
    timestamps: true
}
); 

const Note = mongoose.model('Note', noteSchema);
export default Note;