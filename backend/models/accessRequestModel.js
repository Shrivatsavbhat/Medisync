const mongoose = require('mongoose');

const accessRequestSchema = new mongoose.Schema({
  doctorEmail: {
    type: String,
    required: true,
  },
  patientEmail: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'denied'],
    default: 'pending',
  },
  requestedAt: {
    type: Date,
    default: Date.now,
  },
  respondedAt: {
    type: Date,
  },
  reason: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("AccessRequest", accessRequestSchema);