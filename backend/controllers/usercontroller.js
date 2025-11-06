const jwt = require('jsonwebtoken');
const { User } = require('../models/userModel');
const SECRET_KEY = process.env.JWT_SECRET_KEY;

const createUser = async (req, res) => {
  const { name, email, password, role, specialization, medicalLicense } = req.body;
  
  if (!name || !email || !password || !role) {
    return res.json({ Message: "All fields required" });
  }

  if (role === 'doctor' && (!specialization || !medicalLicense)) {
    return res.json({ Message: "Specialization and medical license required for doctors" });
  }

  const existUser = await User.findOne({ email });
  if (existUser) {
    return res.json({ msg: 'Email already exists' });
  }

  const userData = { firstName: name, email, password, role };
  
  if (role === 'doctor') {
    userData.specialization = specialization;
    userData.medicalLicense = medicalLicense;
    userData.approvalStatus = 'pending';
  }
  
  await User.create(userData);
  res.json({ msg: "Success" });
};

const loginUser = async (req, res) => {
  const { email, password, role } = req.body;
  
  if (!email || !password || !role) {
    return res.json({ success: false, msg: "All fields required" });
  }

  const existUser = await User.findOne({ email });
  if (!existUser) {
    return res.json({ success: false, msg: 'Email does not exist' });
  }

  if (password === existUser.password && role === existUser.role) {
    if (existUser.role === 'doctor' && existUser.approvalStatus !== 'approved') {
      return res.json({ success: false, msg: 'Your account is pending admin approval' });
    }
    
    const token = jwt.sign({ email: existUser.email, role: existUser.role, userId: existUser._id }, SECRET_KEY, { expiresIn: '1h' });
    return res.json({ success: true, msg: 'Login Successful', token, userName: existUser.firstName });
  } else {
    return res.json({ success: false, msg: 'Password or role incorrect' });
  }
};

const getAllUsers = async (req, res) => {
  if (req.user.role === 'admin') {
    const users = await User.find({}, '-password');
    res.json(users);
  } else if (req.user.role === 'patient') {
    const doctors = await User.find({ role: 'doctor' }, '-password');
    res.json(doctors);
  } else {
    res.status(403).json({ msg: "Access denied" });
  }
};

const getAllAccessRequests = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: "Admin access required" });
  }
  
  const AccessRequest = require('../models/accessRequestModel');
  const requests = await AccessRequest.find({}).sort({ requestedAt: -1 });
  res.json(requests);
};

const getPendingDoctors = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: "Admin access required" });
  }
  
  const pendingDoctors = await User.find({ role: 'doctor', approvalStatus: 'pending' }, '-password');
  res.json(pendingDoctors);
};

const updateDoctorStatus = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: "Admin access required" });
  }
  
  const { doctorId, status } = req.body;
  
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ msg: "Invalid status" });
  }
  
  const doctor = await User.findByIdAndUpdate(doctorId, { approvalStatus: status }, { new: true });
  
  if (!doctor) {
    return res.status(404).json({ msg: "Doctor not found" });
  }
  
  res.json({ msg: `Doctor ${status} successfully`, doctor });
};

const updatePatientProfile = async (req, res) => {
  const { age, gender, height, weight } = req.body;
  const userEmail = req.user.email;
  
  const user = await User.findOneAndUpdate(
    { email: userEmail },
    { age, gender, height, weight, profileCompleted: true },
    { new: true }
  );
  
  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }
  
  res.json({ success: true, msg: "Profile updated successfully" });
};

const getPatientProfile = async (req, res) => {
  const userEmail = req.user.email;
  const user = await User.findOne({ email: userEmail }, 'age gender height weight');
  
  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }
  
  res.json(user);
};

const deleteUser = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: "Admin access required" });
  }
  
  const { userId } = req.body;
  
  try {
    const user = await User.findByIdAndDelete(userId);
    
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    
    res.json({ success: true, msg: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

module.exports = { 
  createUser, 
  loginUser, 
  getAllUsers, 
  getAllAccessRequests, 
  getPendingDoctors, 
  updateDoctorStatus, 
  updatePatientProfile, 
  getPatientProfile,
  deleteUser
};