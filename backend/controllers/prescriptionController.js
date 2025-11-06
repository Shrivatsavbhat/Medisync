const Prescription = require('../models/prescriptionModel');
const Tracker = require('../models/trackerModel');

const prescribeMedication = async (req, res) => {
  try {
    const { patientEmail, doctorEmail, name, dosage, frequency, startDate, endDate, notes } = req.body;
    
    if (!patientEmail || !doctorEmail || !name || !dosage || !frequency || !startDate || !notes) {
      return res.status(400).json({ msg: "All fields are required except endDate" });
    }

    const prescription = new Prescription({
      patientEmail,
      doctorEmail,
      name,
      dosage,
      frequency,
      startDate,
      endDate: endDate || null,
      notes,
      status: 'pending'
    });

    await prescription.save();
    res.json({ success: true, msg: "Prescription created successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

const getPendingPrescriptions = async (req, res) => {
  try {
    const patientEmail = req.user.email;
    const prescriptions = await Prescription.find({ patientEmail, status: 'pending' }).sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

const getAllPrescriptions = async (req, res) => {
  try {
    const patientEmail = req.user.email;
    const prescriptions = await Prescription.find({ patientEmail }).sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

const updatePrescriptionStatus = async (req, res) => {
  try {
    const { prescriptionId, status } = req.body;
    const patientEmail = req.user.email;
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    const prescription = await Prescription.findOneAndUpdate(
      { _id: prescriptionId, patientEmail },
      { status },
      { new: true }
    );

    if (!prescription) {
      return res.status(404).json({ msg: "Prescription not found" });
    }

    // If approved, create tracker
    if (status === 'approved') {
      const tracker = new Tracker({
        patientEmail: prescription.patientEmail,
        name: prescription.name,
        dosage: prescription.dosage,
        frequency: prescription.frequency,
        doctor: prescription.doctorEmail,
        startDate: prescription.startDate,
        endDate: prescription.endDate,
        notes: prescription.notes,
        reminders: []
      });

      // Generate reminders
      const start = new Date(prescription.startDate);
      const end = prescription.endDate ? new Date(prescription.endDate) : new Date(start.getFullYear() + 1, start.getMonth(), start.getDate());
      
      const pattern = prescription.frequency.split('-').map(x => parseInt(x));
      const timeSlots = ['morning', 'afternoon', 'night'];
      const timeHours = { morning: 8, afternoon: 14, night: 20 };

      let current = new Date(start);
      while (current <= end) {
        pattern.forEach((take, index) => {
          if (take === 1 && timeSlots[index]) {
            const reminderTime = new Date(current);
            reminderTime.setHours(timeHours[timeSlots[index]], 0, 0, 0);
            tracker.reminders.push({ 
              date: reminderTime, 
              time: timeSlots[index],
              status: "Pending" 
            });
          }
        });
        current.setDate(current.getDate() + 1);
      }

      await tracker.save();
    }

    res.json({ success: true, msg: `Prescription ${status} successfully` });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

const getDoctorPrescriptions = async (req, res) => {
  try {
    const doctorEmail = req.user.email;
    const prescriptions = await Prescription.find({ doctorEmail }).sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

module.exports = {
  prescribeMedication,
  getPendingPrescriptions,
  getAllPrescriptions,
  updatePrescriptionStatus,
  getDoctorPrescriptions
};