const express = require('express');
const router = express.Router();
const { getStudents, addStudent, deleteStudent, updateStudent, getBatches, addBatch, deleteBatch, addSubject, getAttendance, markAttendance, updateAttendance, addMarksheet, getOverviewStats, getMarksheets, updateMarksheet, updateBatchFees, updateStudentFees } = require('../controllers/adminController');
const { protect, adminOrManager } = require('../middleware/authMiddleware');

router.use(protect, adminOrManager);

router.get('/overview', getOverviewStats);
router.route('/students').get(getStudents).post(addStudent);
router.route('/students/:id').put(updateStudent).delete(deleteStudent);
router.route('/students/:id/subject').post(addSubject);

router.route('/batches').get(getBatches).post(addBatch);
router.route('/batches/:id').delete(deleteBatch);

router.route('/attendance').get(getAttendance).post(markAttendance);
router.route('/attendance/:id').put(updateAttendance);

router.route('/marksheets').get(getMarksheets).post(addMarksheet);
router.route('/marksheets/:id').put(updateMarksheet);

router.put('/fees/batch', updateBatchFees);
router.put('/fees/student/:id', updateStudentFees);

module.exports = router;
