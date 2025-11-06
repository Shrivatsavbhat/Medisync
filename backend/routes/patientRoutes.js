const express = require('express');
const multer = require('multer');
const patientcontroller = require('../controllers/patientController');
const usercontroller = require('../controllers/usercontroller');
const { verifyToken } = require('../middleware/auth');
const {
  addTracker,
  getReminders,
  getTodayReminders,
  updateReminderStatus,
  getTrackers,
  getPendingTrackers,
  updateTrackerStatus
} = require("../controllers/trackerController");
const {
  getPendingPrescriptions,
  getAllPrescriptions,
  updatePrescriptionStatus
} = require("../controllers/prescriptionController");

const router = express.Router();
const upload = multer();

router.post('/addRecord', verifyToken, upload.single("file"), patientcontroller.addRecord);
router.get('/pendingRecords', verifyToken, patientcontroller.getPendingRecords);
router.post('/updateRecordStatus', verifyToken, patientcontroller.updateRecordStatus);
router.delete('/deleteRecord/:recordId', verifyToken, patientcontroller.deleteRecord);
router.post('/addTracker', verifyToken, addTracker);
router.get('/getReminders', verifyToken, getReminders);
router.get('/getTodayReminders', verifyToken, getTodayReminders);
router.put('/updateReminder/:id', verifyToken, updateReminderStatus);
router.get('/getTrackers', verifyToken, getTrackers);
router.get('/getPendingTrackers', verifyToken, getPendingTrackers);
router.post('/updateTrackerStatus', verifyToken, updateTrackerStatus);
router.get('/getPendingPrescriptions', verifyToken, getPendingPrescriptions);
router.get('/getAllPrescriptions', verifyToken, getAllPrescriptions);
router.post('/updatePrescriptionStatus', verifyToken, updatePrescriptionStatus);
router.post('/updateProfile', verifyToken, usercontroller.updatePatientProfile);
router.get('/profile', verifyToken, usercontroller.getPatientProfile);

module.exports = router;