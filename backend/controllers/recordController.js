// controllers/recordController.js
const MediRecord = require("../models/recordModel");
const { checkAccess } = require('./accessController');

const getPatientReports = async (req, res) => {
  try {
    const { patientId } = req.params;
    const userEmail = req.user.email;
    const userRole = req.user.role;

    let searchQuery;
    
    if (userRole === 'admin') {
      searchQuery = { 
        Email: patientId,
        status: 'approved'
      };
    } else if (userRole === 'doctor') {
      const hasAccess = await checkAccess(userEmail, patientId);
      if (!hasAccess) {
        return res.status(403).json({ msg: "Access denied. Request patient approval first." });
      }
      searchQuery = { 
        Email: patientId,
        status: 'approved'
      };
    } else {
      searchQuery = { 
        Email: userEmail,
        status: 'approved'
      };
    }

    const reports = await MediRecord.find(searchQuery);
    res.json(reports || []);
  } catch (err) {
    console.error("Error fetching reports:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Download medical file
const downloadFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const userEmail = req.user.email;
    const userRole = req.user.role;

    const record = await MediRecord.findById(fileId);
    if (!record) {
      return res.status(404).json({ msg: "File not found" });
    }

    // Check access permissions
    if (userRole === 'admin') {
      // Admins can download any file
    } else if (userRole === 'doctor') {
      // Doctors need approved access
      const hasAccess = await checkAccess(userEmail, record.Email);
      if (!hasAccess) {
        return res.status(403).json({ msg: "Access denied" });
      }
    } else if (userRole === 'patient') {
      // Patients can only download their own files
      if (record.Email !== userEmail) {
        return res.status(403).json({ msg: "Access denied" });
      }
    }

    // Set headers for file download
    res.set({
      'Content-Type': record.mimetype,
      'Content-Disposition': `attachment; filename="${record.filename}"`,
      'Content-Length': record.data.length
    });

    res.send(record.data);
  } catch (err) {
    console.error("Error downloading file:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

module.exports = { getPatientReports, downloadFile };
