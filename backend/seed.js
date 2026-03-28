const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Batch = require('./models/Batch');
const Attendance = require('./models/Attendance');
const Marksheet = require('./models/Marksheet');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tuition-db';

mongoose.connect(MONGO_URI).then(async () => {
  console.log('Connected to MongoDB');
  
  await User.deleteMany({});
  await Batch.deleteMany({});
  await Attendance.deleteMany({});
  await Marksheet.deleteMany({});

  const hashedAdminPass = await bcrypt.hash('admin123', 10);
  await User.create({
    name: 'Admin User',
    email: 'admin@institute.edu',
    password: hashedAdminPass,
    role: 'admin',
    institutionName: 'Delta Institute'
  });

  const hashedManagerPass = await bcrypt.hash('manager123', 10);
  await User.create({
    name: 'Manager User',
    email: 'manager@test.com',
    password: hashedManagerPass,
    role: 'manager',
    institutionName: 'Delta Institute'
  });

  const batch = await Batch.create({
    name: 'Class 10 - Mathematics',
    standard: '10th',
    subjects: ['Maths'],
    schedule: 'Mon-Wed-Fri 4PM-5PM'
  });

  const hashedStudentPass = await bcrypt.hash('student123', 10);
  const student = await User.create({
    name: 'John Doe',
    email: 'john@student.edu',
    password: hashedStudentPass,
    role: 'student',
    standard: '10th',
    batch: batch._id,
    parentContact: '1234567890'
  });

  // Add dummy attendance
  await Attendance.create({
    date: new Date(new Date().setDate(new Date().getDate() - 2)),
    batch: batch._id,
    records: [{ student: student._id, status: 'present' }]
  });
  await Attendance.create({
    date: new Date(new Date().setDate(new Date().getDate() - 1)),
    batch: batch._id,
    records: [{ student: student._id, status: 'absent' }]
  });
  await Attendance.create({
    date: new Date(),
    batch: batch._id,
    records: [{ student: student._id, status: 'present' }]
  });

  // Add dummy marksheet
  await Marksheet.create({
    title: 'Midterm Examination 2026',
    subject: 'Maths',
    date: new Date(),
    batch: batch._id,
    records: [{ student: student._id, marksObtained: 85, totalMarks: 100, remarks: 'Excellent performance' }]
  });

  console.log('Seed data inserted successfully!');
  console.log('Admin: admin@institute.edu / admin123');
  console.log('Manager: manager@test.com / manager123');
  console.log('Student: john@student.edu / student123');
  
  mongoose.disconnect();
}).catch(err => console.error(err));
