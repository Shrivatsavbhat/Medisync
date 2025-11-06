const Tracker = require("../models/trackerModel");

// Generate daily reminders between startDate and endDate

// Add new Tracker with daily reminders
const addTracker = async (req, res) => {
  try {
    const { name, dosage, frequency, doctor, startDate, endDate, notes, patientEmail: targetPatientEmail } = req.body;
    const { email, role } = req.user;

    if (!name || !dosage || !frequency || !doctor || !startDate || !notes) {
      return res.status(400).json({ msg: "All fields are required except endDate" });
    }

    // Determine target patient - if doctor is adding, use targetPatientEmail from request
    const finalPatientEmail = role === 'doctor' && targetPatientEmail ? targetPatientEmail : email;

    const newTracker = new Tracker({
      patientEmail: finalPatientEmail,
      name,
      dosage,
      frequency,
      doctor,
      startDate,
      endDate: endDate || null,
      notes,
      addedBy: email,
      addedByRole: role,
      status: role === 'patient' ? 'approved' : 'pending',
      reminders: []
    });

    // Only generate reminders if approved (patient-added) or will be approved later
    if (newTracker.status === 'approved') {
      const start = new Date(startDate);
      const end = endDate ? new Date(endDate) : new Date(start.getFullYear() + 1, start.getMonth(), start.getDate());
      
      const pattern = frequency.split('-').map(x => parseInt(x));
      const timeSlots = ['morning', 'afternoon', 'night'];
      const timeHours = { morning: 8, afternoon: 14, night: 20 };

      let current = new Date(start);
      while (current <= end) {
        pattern.forEach((take, index) => {
          if (take === 1 && timeSlots[index]) {
            const reminderTime = new Date(current);
            reminderTime.setHours(timeHours[timeSlots[index]], 0, 0, 0);
            newTracker.reminders.push({ 
              date: reminderTime, 
              time: timeSlots[index],
              status: "Pending" 
            });
          }
        });
        current.setDate(current.getDate() + 1);
      }
    }

    await newTracker.save();
    return res.json({ success: true, msg: "Tracker added successfully", data: newTracker });

  } catch (error) {
    console.error("Error adding tracker:", error);
    return res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

// Get reminders with optional date filtering
const getReminders = async (req, res) => {
  try {
    const patientEmail = req.user.email;
    const { date } = req.query;
    
    if (!date) {
      return res.json([]);
    }

    const selectedDate = new Date(date);
    const now = new Date();
    
    const trackers = await Tracker.find({ patientEmail });
    const reminders = trackers.flatMap(t =>
      t.reminders
        .filter(r => {
          const reminderDate = new Date(r.date).toDateString();
          const selectedDateStr = selectedDate.toDateString();
          return reminderDate === selectedDateStr;
        })
        .map(r => {
          let status = r.status;
          // Auto-mark as missed if past the day and still pending
          if (status === 'Pending' && new Date(r.date) < now && selectedDate < now) {
            status = 'Missed';
          }
          return {
            _id: r._id,
            medicineName: t.name,
            dosage: t.dosage,
            time: r.time,
            date: r.date,
            status: status
          };
        })
    );
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching reminders", error: error.message });
  }
};

// Update reminder status
const updateReminderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const patientEmail = req.user.email;

    const tracker = await Tracker.findOne({
      patientEmail,
      "reminders._id": id
    });

    if (!tracker) return res.status(404).json({ msg: "Reminder not found" });

    const reminder = tracker.reminders.find(r => r._id.toString() === id);
    if (!reminder) return res.status(404).json({ msg: "Reminder not found" });

    // Check if current time is after the scheduled time
    const now = new Date();
    const scheduledTime = new Date(reminder.date);
    
    if (now < scheduledTime) {
      return res.status(400).json({ 
        msg: `Cannot update status before scheduled time (${scheduledTime.toLocaleTimeString()})` 
      });
    }

    // Update the reminder status
    await Tracker.findOneAndUpdate(
      { "reminders._id": id },
      { $set: { "reminders.$.status": status } },
      { new: true }
    );

    res.json({ success: true, msg: `Status updated to ${status}` });

  } catch (error) {
    res.status(500).json({ msg: "Error updating reminder", error: error.message });
  }
};

const getDueReminders = async () => {
  try {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

    const trackers = await Tracker.find({
      "reminders.date": { $gte: fiveMinutesAgo, $lte: now },
      "reminders.status": "Pending"
    });

    const dueReminders = [];
    trackers.forEach(tracker => {
      tracker.reminders.forEach(reminder => {
        if (reminder.date >= fiveMinutesAgo && reminder.date <= now && reminder.status === "Pending") {
          dueReminders.push({
            trackerId: tracker._id,
            reminderId: reminder._id,
            patientEmail: tracker.patientEmail,
            medicationName: tracker.name,
            dosage: tracker.dosage,
            time: reminder.time, // morning/afternoon/night
            scheduledTime: reminder.date
          });
        }
      });
    });

    return dueReminders;
  } catch (error) {
    console.error("Error fetching due reminders:", error);
    return [];
  }
};

const getTodayReminders = async (req, res) => {
  try {
    const patientEmail = req.user.email;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const trackers = await Tracker.find({
      patientEmail,
      "reminders.date": { $gte: today, $lt: tomorrow }
    });

    const todayReminders = trackers.flatMap(t =>
      t.reminders
        .filter(r => r.date >= today && r.date < tomorrow)
        .map(r => ({
          _id: r._id,
          medicineName: t.name,
          dosage: t.dosage,
          time: r.time,
          date: r.date,
          status: r.status
        }))
    );

    res.json(todayReminders);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching today's reminders", error: error.message });
  }
};



const getTrackers = async (req, res) => {
  try {
    const patientEmail = req.user.email;
    const trackers = await Tracker.find({ patientEmail, status: 'approved' }).select('-reminders').sort({ createdAt: -1 });
    res.json(trackers);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching trackers", error: error.message });
  }
};

const getPendingTrackers = async (req, res) => {
  try {
    const { email, role } = req.user;
    const trackers = await Tracker.find({ 
      patientEmail: email,
      status: 'pending',
      addedByRole: { $ne: role }
    }).select('-reminders').sort({ createdAt: -1 });
    res.json(trackers);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching pending trackers", error: error.message });
  }
};

const updateTrackerStatus = async (req, res) => {
  try {
    const { trackerId, status } = req.body;
    const { email } = req.user;
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    const tracker = await Tracker.findOneAndUpdate(
      { _id: trackerId, patientEmail: email },
      { status },
      { new: true }
    );

    if (!tracker) {
      return res.status(404).json({ msg: "Tracker not found" });
    }

    // If approved, generate reminders
    if (status === 'approved') {
      const start = new Date(tracker.startDate);
      const end = tracker.endDate ? new Date(tracker.endDate) : new Date(start.getFullYear() + 1, start.getMonth(), start.getDate());
      
      const pattern = tracker.frequency.split('-').map(x => parseInt(x));
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

    res.json({ success: true, msg: `Tracker ${status} successfully` });
  } catch (error) {
    res.status(500).json({ msg: "Error updating tracker status", error: error.message });
  }
};

module.exports = {
  addTracker,
  getReminders,
  getDueReminders,
  getTodayReminders,
  updateReminderStatus,
  getTrackers,
  getPendingTrackers,
  updateTrackerStatus
};

