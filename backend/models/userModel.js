const mongoose = require('mongoose');

//UserSchema
const userSchema = new mongoose.Schema({
    firstName:  {
        type : String,
        required: true,
    },
    email: {
        type : String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    // Doctor-specific fields
    specialization: {
        type: String,
        required: function() { return this.role === 'doctor'; }
    },
    medicalLicense: {
        type: String,
        required: function() { return this.role === 'doctor'; }
    },
    approvalStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: function() { return this.role === 'doctor' ? 'pending' : 'approved'; }
    },
    // Patient profile fields
    age: { type: Number },
    gender: { type: String },
    height: { type: Number },
    weight: { type: Number },
    profileCompleted: { type: Boolean, default: false }
}, { timestamps: true });

const User = mongoose.model('user', userSchema);

    module.exports={User};