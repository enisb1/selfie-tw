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
    telegram: String
});

// model created from schema
const User = mongoose.model('User', userSchema);

export default User;