const User = require('../models/User');
const Batch = require('../models/Batch');
const Attendance = require('../models/Attendance');
const Marksheet = require('../models/Marksheet');
const bcrypt = require('bcryptjs');

exports.getOverviewStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const activeBatches = await Batch.countDocuments();
    
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    
    const todayAttendance = await Attendance.countDocuments({
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    res.json({ totalStudents, activeBatches, todayAttendance });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// === STUDENTS ===
exports.getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).populate('batch');
    res.json(students);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.addStudent = async (req, res) => {
  try {
    const { name, email, password, standard, batch, fatherContact, motherContact, totalFees, feesPaid } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    let baseFee = totalFees || 0;
    if (!baseFee && batch) {
      const b = await Batch.findById(batch);
      if (b && b.defaultFee) baseFee = b.defaultFee;
    }

    const student = await User.create({ name, email, password: hashedPassword, plainPassword: password, role: 'student', standard, batch, fatherContact, motherContact, totalFees: baseFee, feesPaid: feesPaid || 0 });
    res.status(201).json(student);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.deleteStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    await User.findByIdAndDelete(studentId);
    
    // Cascading deletes for embedded sub-documents
    await Attendance.updateMany(
      { "records.student": studentId },
      { $pull: { records: { student: studentId } } }
    );
    await Marksheet.updateMany(
      { "records.student": studentId },
      { $pull: { records: { student: studentId } } }
    );
    
    res.json({ message: 'Student removed & records sanitized' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.updateStudent = async (req, res) => {
  try {
    const { name, email, standard, batch, fatherContact, motherContact, plainPassword } = req.body;
    let updateFields = { name, email, standard, batch: batch || null, fatherContact, motherContact };

    // Automatically apply batch fee if they are moved into a batch and currently have no fees
    if (batch) {
      const existingStudent = await User.findById(req.params.id);
      if (existingStudent && (!existingStudent.totalFees || existingStudent.totalFees === 0)) {
        const b = await Batch.findById(batch);
        if (b && b.defaultFee) updateFields.totalFees = b.defaultFee;
      }
    }
    
    if (plainPassword) {
      updateFields.plainPassword = plainPassword;
      updateFields.password = await bcrypt.hash(plainPassword, 10);
    }

    const student = await User.findByIdAndUpdate(
      req.params.id, 
      updateFields, 
      { new: true }
    );
    res.json(student);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// === BATCHES ===
exports.getBatches = async (req, res) => {
  try {
    const batches = await Batch.find();
    const batchesWithCounts = await Promise.all(
      batches.map(async (batch) => {
        const studentCount = await User.countDocuments({ role: 'student', batch: batch._id });
        return { ...batch.toObject(), studentCount };
      })
    );
    res.json(batchesWithCounts);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.addBatch = async (req, res) => {
  try {
    const batch = await Batch.create(req.body);
    res.status(201).json(batch);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.deleteBatch = async (req, res) => {
  try {
    await Batch.findByIdAndDelete(req.params.id);
    res.json({ message: 'Batch removed' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.addSubject = async (req, res) => {
  try {
    const { subject } = req.body;
    const student = await User.findById(req.params.id);
    if (!student.subjects.includes(subject)) {
      student.subjects.push(subject);
      await student.save();
    }
    res.json(student);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// === ATTENDANCE ===
exports.getAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find().populate('batch', 'name standard').sort({ date: -1 });
    res.json(attendance);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.markAttendance = async (req, res) => {
  try {
    const { date, batch, records } = req.body;
    const attendance = await Attendance.create({ date, batch, records });
    res.status(201).json(attendance);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(attendance);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.deleteAttendance = async (req, res) => {
  try {
    await Attendance.findByIdAndDelete(req.params.id);
    res.json({ message: 'Attendance record deleted globally' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// === MARKS ===
exports.addMarksheet = async (req, res) => {
  try {
    const { title, subject, date, batch, records } = req.body;
    const marksheet = await Marksheet.create({ title, subject, date, batch, records });
    res.status(201).json(marksheet);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.getMarksheets = async (req, res) => {
  try {
    const marksheets = await Marksheet.find().populate('batch', 'name standard').sort({ createdAt: -1 });
    res.json(marksheets);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.updateMarksheet = async (req, res) => {
  try {
    const marksheet = await Marksheet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(marksheet);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.deleteMarksheet = async (req, res) => {
  try {
    await Marksheet.findByIdAndDelete(req.params.id);
    res.json({ message: 'Marksheet record deleted globally' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// === FEES ===
exports.updateBatchFees = async (req, res) => {
  try {
    const { batchId, totalFees } = req.body;
    await User.updateMany({ role: 'student', batch: batchId }, { $set: { totalFees } });
    await Batch.findByIdAndUpdate(batchId, { defaultFee: totalFees });
    res.json({ message: 'Batch fees updated successfully' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.updateStudentFees = async (req, res) => {
  try {
    const { totalFees, feesPaid } = req.body;
    const existingStudent = await User.findById(req.params.id);
    
    // Only calculate history if feesPaid changed
    let paymentAmount = 0;
    if (feesPaid !== undefined && existingStudent) {
      paymentAmount = Number(feesPaid) - (existingStudent.feesPaid || 0);
    }
    
    let updateOps = { $set: { totalFees, feesPaid } };
    
    if (paymentAmount > 0) {
      updateOps.$push = { feeHistory: { amount: paymentAmount, date: new Date(), method: 'Cash' } };
    }

    const student = await User.findByIdAndUpdate(req.params.id, updateOps, { new: true });
    res.json(student);
  } catch (error) { res.status(500).json({ message: error.message }); }
};
