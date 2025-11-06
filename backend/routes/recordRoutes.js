// routes/recordRoutes.js
const express = require("express");
const patient  = require("../controllers/recordController");
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

router.get("/records/:patientId", verifyToken, patient.getPatientReports);
router.get("/download/:fileId", verifyToken, patient.downloadFile);

module.exports = router;
