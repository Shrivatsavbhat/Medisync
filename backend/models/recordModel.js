const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
  },
  patientEmail: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
  filename: {
    type: String,
    required: true,
  },
  mimetype: {
    type: String,
    required: true,
  },
  data: {
    type: Buffer,   // binary
    required: true,
  },
  addedBy: {
    type: String,
    required: true,
  },
  addedByRole: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  approvedAt: {
    type: Date
  }
});


module.exports = mongoose.model("MediRecord", recordSchema);