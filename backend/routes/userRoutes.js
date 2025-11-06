const express = require('express');
const usercontroller = require('../controllers/usercontroller');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

router.post('/register', usercontroller.createUser);
router.post('/login', usercontroller.loginUser);
router.get('/users', verifyToken, usercontroller.getAllUsers);
router.get('/all-access-requests', verifyToken, usercontroller.getAllAccessRequests);
router.get('/pending-doctors', verifyToken, usercontroller.getPendingDoctors);
router.post('/update-doctor-status', verifyToken, usercontroller.updateDoctorStatus);
router.delete('/delete-user', verifyToken, usercontroller.deleteUser);






module.exports = router;