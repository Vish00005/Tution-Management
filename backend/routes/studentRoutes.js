const express = require('express');
const router = express.Router();
const { getStudentStats } = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/stats', protect, getStudentStats);

module.exports = router;
