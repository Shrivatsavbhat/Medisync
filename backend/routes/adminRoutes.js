const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminAuth = require('../middleware/adminauth');
const { verifyToken } = require('../middleware/auth');
const MediRecord = require('../models/recordModel');
const Prescription = require('../models/prescriptionModel');

// Apply admin authentication to all routes
router.use(adminAuth);

// User management routes
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// Analytics routes
router.get('/analytics', adminController.getAnalytics);

// Doctor approval routes
router.post('/doctor-approval', adminController.manageDoctorApproval);

// Admin data routes
router.get('/records', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Admin access required' });
    }
    const records = await MediRecord.find({}).sort({ uploadedAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
});

router.get('/prescriptions', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Admin access required' });
    }
    const prescriptions = await Prescription.find({}).sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
});

module.exports = router;