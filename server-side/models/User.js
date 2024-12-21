import mongoose from 'mongoose';

// schema
const userSchema = new mongoose.Schema({
    username: String,
    passwordHash: String,
    email: String,
    firstName: String,
    lastName: String,
    isAResource: Boolean,
    isAdmin: Boolean,
    telegram: String,
    unavailableStart: Date,
    unavailableEnd: Date,
    unavailableFrequency: String,
    unavailableRepNumber: Number,
    unavailableRepDate: Date
});

// model created from schema
const User = mongoose.model('User', userSchema);

export default User;