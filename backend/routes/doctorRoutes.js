const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { prescribeMedication, getDoctorPrescriptions } = require('../controllers/prescriptionController');
const { getPatientReports, downloadFile } = require('../controllers/recordController');

router.post('/prescribeMedication', verifyToken, prescribeMedication);
router.get('/prescriptions', verifyToken, getDoctorPrescriptions);
router.get('/records/:patientId', verifyToken, getPatientReports);
router.get('/download/:fileId', verifyToken, downloadFile);

module.exports = router;