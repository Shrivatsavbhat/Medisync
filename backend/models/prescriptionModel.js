const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  patientEmail: { type: String, required: true },
  doctorEmail: { type: String, required: true },
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  frequency: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  notes: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);