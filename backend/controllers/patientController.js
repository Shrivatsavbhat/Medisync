const MediRecord = require('../models/recordModel');
const Tracker = require('../models/trackerModel');

const addRecord = async (req, res) => {
  try {
    const { title, notes, patientId } = req.body;
    const file = req.file;
    const { userId, email, role } = req.user;

    if (!title || !notes || !file) {
      return res.status(400).json({ msg: "All fields required" });
    }

    // Determine target patient - if doctor is adding, use patientId from request
    const targetPatientEmail = role === 'doctor' && patientId ? patientId : email;

    const newRecord = new MediRecord({
      patientId: targetPatientEmail, // Use email as patientId for consistency
      patientEmail: targetPatientEmail,
      Email: targetPatientEmail,
      title,
      notes,
      filename: file.originalname,
      mimetype: file.mimetype,
      data: file.buffer,
      addedBy: email,
      addedByRole: role,
      status: role === 'patient' ? 'approved' : 'pending'
    });

    await newRecord.save();
    return res.json({ success: true, msg: "Record added successfully", data: newRecord });
  } catch (error) {
    console.error("Error adding record:", error);
    return res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

const addTracker = async (req, res) => {
  try {
    const { name, dosage, frequency, doctor, startDate, endDate, notes } = req.body;
    const { email } = req.user;

    if (!name || !dosage || !frequency || !doctor || !startDate) {
      return res.status(400).json({ msg: "All fields are required except endDate and notes" });
    }

    const newTracker = new Tracker({
      patientEmail: email,
      name,
      dosage,
      frequency,
      doctor,
      startDate,
      endDate: endDate || null,
      notes: notes || "",
    });

    await newTracker.save();
    return res.json({ success: true, msg: "Tracker added successfully", data: newTracker });
  } catch (error) {
    console.error("Error adding tracker:", error);
    return res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

const getPendingRecords = async (req, res) => {
  try {
    const { userId, email, role } = req.user;
    
    // Only show records that need approval from the current user
    // For patients: show doctor-added records that need their approval
    const records = await MediRecord.find({ 
      $or: [{ patientId: userId }, { Email: email }],
      status: 'pending',
      addedByRole: { $ne: role } // Only show records added by different role
    });
    return res.json(records);
  } catch (error) {
    console.error("Error getting pending records:", error);
    return res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

const updateRecordStatus = async (req, res) => {
  try {
    const { recordId, status } = req.body;
    
    if (!recordId || !status) {
      return res.status(400).json({ msg: "Record ID and status required" });
    }

    const record = await MediRecord.findByIdAndUpdate(
      recordId,
      { status, approvedAt: status === 'approved' ? new Date() : undefined },
      { new: true }
    );

    if (!record) {
      return res.status(404).json({ msg: "Record not found" });
    }

    return res.json({ success: true, msg: "Record status updated", data: record });
  } catch (error) {
    console.error("Error updating record status:", error);
    return res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

const deleteRecord = async (req, res) => {
  try {
    const { recordId } = req.params;
    const { email, role } = req.user;
    
    const record = await MediRecord.findById(recordId);
    if (!record) {
      return res.status(404).json({ msg: "Record not found" });
    }

    // Only allow patients to delete their own records
    if (role !== 'patient' || record.Email !== email) {
      return res.status(403).json({ msg: "Access denied" });
    }

    await MediRecord.findByIdAndDelete(recordId);
    return res.json({ success: true, msg: "Record deleted successfully" });
  } catch (error) {
    console.error("Error deleting record:", error);
    return res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

module.exports = { addRecord, addTracker, getPendingRecords, updateRecordStatus, deleteRecord };