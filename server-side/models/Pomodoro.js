import mongoose from "mongoose";

const pomodoroSchema = new mongoose.Schema({
    
    workTime: {
        type: Number,
        required: true,
    },
    relaxTime: {
        type: Number,
        required: true,
    },
    cycleNum: {
        type: Number,
        required: true,
    },
    user: {
        type: String,
        required : true
    },
    
}, {
    timestamps: true
}
); 

const Pomodoro = mongoose.model('Pomodoro', pomodoroSchema);
export default Pomodoro;