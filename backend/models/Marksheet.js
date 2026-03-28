const mongoose = require('mongoose');

const marksheetSchema = new mongoose.Schema({
  title: { type: String, required: true }, // e.g. "Midterm 2026", "Weekly Test"
  subject: { type: String, required: true },
  date: { type: Date, required: true },
  batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
  records: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    marksObtained: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    isAbsent: { type: Boolean, default: false },
    remarks: { type: String }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Marksheet', marksheetSchema);
