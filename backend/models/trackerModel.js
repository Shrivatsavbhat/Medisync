const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  time: { type: String, required: true }, // "morning", "afternoon", "night"
  status: { type: String, enum: ["Pending", "Taken", "Missed"], default: "Pending" }
});

const trackerSchema = new mongoose.Schema({
  patientEmail: { type: String, required: true },
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  frequency: { type: String, required: true }, // "1-0-1", "1-1-1", "1-0-0", etc.
  doctor: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  notes: { type: String, required: true },
  addedBy: { type: String, required: true },
  addedByRole: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  reminders: [reminderSchema]
});

module.exports = mongoose.model("Tracker", trackerSchema);
