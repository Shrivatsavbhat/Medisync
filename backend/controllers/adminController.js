const { User } = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password');
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Server error', error: error.message });
    }
};

// Get user by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id, '-password');
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User not found' });
        }
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Server error', error: error.message });
    }
};

// Update user
const updateUser = async (req, res) => {
    try {
        const { firstName, email, role } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { firstName, email, role },
            { new: true, select: '-password' }
        );
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User not found' });
        }
        res.json({ success: true, msg: 'User updated successfully', user });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Server error', error: error.message });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User not found' });
        }
        res.json({ success: true, msg: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Server error', error: error.message });
    }
};

// Get system analytics
const getAnalytics = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const doctors = await User.countDocuments({ role: 'doctor' });
        const patients = await User.countDocuments({ role: 'patient' });
        const admins = await User.countDocuments({ role: 'admin' });

        const analytics = {
            totalUsers,
            usersByRole: { doctors, patients, admins },
            recentUsers: await User.find({}, '-password').sort({ _id: -1 }).limit(5)
        };

        res.json({ success: true, analytics });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Server error', error: error.message });
    }
};

// Approve/reject doctor applications
const manageDoctorApproval = async (req, res) => {
    try {
        const { userId, action } = req.body;
        const user = await User.findById(userId);
        
        if (!user || user.role !== 'doctor') {
            return res.status(404).json({ success: false, msg: 'Doctor not found' });
        }

        // In a real app, you'd have an approval status field
        // For now, we'll just return success
        res.json({ success: true, msg: `Doctor ${action} successfully` });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Server error', error: error.message });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getAnalytics,
    manageDoctorApproval
};