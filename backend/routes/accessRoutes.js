const express = require('express');
const { verifyToken } = require('../middleware/auth');
const { requestAccess, respondToRequest, getPendingRequests, getApprovedPatients } = require('../controllers/accessController');
const router = express.Router();

router.post('/request', verifyToken, requestAccess);
router.post('/respond', verifyToken, respondToRequest);
router.get('/pending', verifyToken, getPendingRequests);
router.get('/approved', verifyToken, getApprovedPatients);



module.exports = router;