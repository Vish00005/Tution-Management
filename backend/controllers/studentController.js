const Attendance = require('../models/Attendance');
const Marksheet = require('../models/Marksheet');
const User = require('../models/User');

exports.getStudentStats = async (req, res) => {
  try {
    const studentId = req.user.id;
    const student = await User.findById(studentId).populate('batch');
    if (!student || !student.batch) return res.status(404).json({ message: 'Batch not assigned' });
    
    // Get all attendance for the student's batch
    const allAttendance = await Attendance.find({ batch: student.batch._id });
    
    let presentCount = 0;
    let totalClasses = allAttendance.length;
    let attendanceRecords = [];

    // Check presence in each class
    allAttendance.forEach(att => {
      const record = att.records.find(r => r.student.toString() === studentId.toString());
      if (record) {
        attendanceRecords.push({ date: att.date, status: record.status });
        if (record.status === 'present') presentCount++;
      }
    });

    const marksheets = await Marksheet.find({ batch: student.batch._id });
    let marksRecords = [];
    marksheets.forEach(mark => {
      const record = mark.records.find(r => r.student.toString() === studentId.toString());
      if (record) {
        // Calculate rank: sort valid records by marksObtained descending
        // Exclude absent students from valid ranking, rank them at the bottom
        const presentRecords = mark.records.filter(r => !r.isAbsent);
        presentRecords.sort((a, b) => b.marksObtained - a.marksObtained);
        
        let rank;
        if (record.isAbsent) {
          rank = 'N/A';
        } else {
          rank = presentRecords.findIndex(r => r.student.toString() === studentId.toString()) + 1;
        }

        marksRecords.push({ 
          title: mark.title, 
          subject: mark.subject, 
          date: mark.date, 
          marksObtained: record.marksObtained, 
          totalMarks: record.totalMarks, 
          remarks: record.remarks,
          isAbsent: record.isAbsent,
          rank: rank,
          classSize: mark.records.length
        });
      }
    });

    res.json({
      studentDetails: student,
      attendanceSummary: {
        total: totalClasses,
        present: presentCount,
        percentage: totalClasses === 0 ? 0 : (presentCount / totalClasses * 100).toFixed(2)
      },
      attendanceRecords,
      marksRecords
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
