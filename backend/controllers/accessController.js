const AccessRequest = require('../models/accessRequestModel');
const { User } = require('../models/userModel');

// Patient requests consultation with doctor (creates access request)
const requestAccess = async (req, res) => {
  try {
    const { patientEmail, reason } = req.body;
    const userEmail = req.user.email;
    const userRole = req.user.role;

    let doctorEmail, finalPatientEmail;
    
    if (userRole === 'doctor') {
      // Doctor requesting access to patient
      doctorEmail = userEmail;
      finalPatientEmail = patientEmail;
      
      const patient = await User.findOne({ email: patientEmail, role: 'patient' });
      if (!patient) {
        return res.status(404).json({ msg: "Patient not found" });
      }
    } else if (userRole === 'patient') {
      // Patient requesting consultation with doctor
      doctorEmail = patientEmail; // In this case, patientEmail is actually doctorEmail
      finalPatientEmail = userEmail;
      
      const doctor = await User.findOne({ email: patientEmail, role: 'doctor' });
      if (!doctor) {
        return res.status(404).json({ msg: "Doctor not found" });
      }
    } else {
      return res.status(403).json({ msg: "Invalid user role" });
    }

    const existingRequest = await AccessRequest.findOne({
      doctorEmail,
      patientEmail: finalPatientEmail,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({ msg: "Request already pending" });
    }

    const newRequest = new AccessRequest({
      doctorEmail,
      patientEmail: finalPatientEmail,
      reason
    });

    await newRequest.save();
    res.json({ success: true, msg: "Access request sent successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Patient or doctor responds to access request
const respondToRequest = async (req, res) => {
  try {
    const { requestId, status } = req.body;
    const userEmail = req.user.email;
    const userRole = req.user.role;

    let request;
    
    if (userRole === 'patient') {
      // Patient responding to doctor's access request
      request = await AccessRequest.findOne({
        _id: requestId,
        patientEmail: userEmail,
        status: 'pending'
      });
    } else if (userRole === 'doctor') {
      // Doctor responding to patient's consultation request
      request = await AccessRequest.findOne({
        _id: requestId,
        doctorEmail: userEmail,
        status: 'pending'
      });
    }

    if (!request) {
      return res.status(404).json({ msg: "Request not found" });
    }

    request.status = status;
    request.respondedAt = new Date();
    await request.save();

    res.json({ success: true, msg: `Request ${status}` });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Get pending requests (for patient or doctor)
const getPendingRequests = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const userRole = req.user.role;
    
    let requests;
    
    if (userRole === 'patient') {
      // Patient sees requests where they need to approve doctor access
      requests = await AccessRequest.find({
        patientEmail: userEmail,
        status: 'pending'
      });
    } else if (userRole === 'doctor') {
      // Doctor sees consultation requests from patients
      requests = await AccessRequest.find({
        doctorEmail: userEmail,
        status: 'pending'
      });
    } else {
      return res.status(403).json({ msg: "Invalid user role" });
    }
    
    res.json(requests);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Check if doctor has access to patient
const checkAccess = async (doctorEmail, patientEmail) => {
  const approvedRequest = await AccessRequest.findOne({
    doctorEmail,
    patientEmail,
    status: 'approved'
  });
  return !!approvedRequest;
};

// Get all approved patients for a doctor
const getApprovedPatients = async (req, res) => {
  try {
    const doctorEmail = req.user.email;
    
    const approvedRequests = await AccessRequest.find({
      doctorEmail,
      status: 'approved'
    });

    const patients = [];
    for (const request of approvedRequests) {
      const patient = await User.findOne({ email: request.patientEmail });
      patients.push({
        email: request.patientEmail,
        name: patient ? patient.firstName : 'Unknown',
        approvedAt: request.respondedAt,
        reason: request.reason
      });
    }

    res.json(patients);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

module.exports = { requestAccess, respondToRequest, getPendingRequests, checkAccess, getApprovedPatients };