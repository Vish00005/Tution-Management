const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Batch = require("./models/Batch");
const Attendance = require("./models/Attendance");
const Marksheet = require("./models/Marksheet");
const dotenv = require("dotenv");

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/tuition-db";

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB");

    await User.deleteMany({});
    await Batch.deleteMany({});
    await Attendance.deleteMany({});
    await Marksheet.deleteMany({});

    const hashedPass = await bcrypt.hash("admin123", 10);
    const hashedManagerPass = await bcrypt.hash("manager123", 10);
    const hashedStudentPass = await bcrypt.hash("student123", 10);

    // Core Staff
    await User.create({
      name: "Admin User",
      email: "admin@institute.edu",
      password: hashedPass,
      role: "admin",
      institutionName: "Delta Institute",
    });
    await User.create({
      name: "Manager User",
      email: "manager@institute.edu",
      password: hashedManagerPass,
      role: "manager",
      institutionName: "Delta Institute",
    });

    const standards = ["8th", "9th", "10th"];
    const subjectsPool = ["Maths", "Science", "English", "History"];
    const batchesData = [];

    for (let std of standards) {
      const batchA = await Batch.create({
        name: `A`,
        standard: std,
        subjects: subjectsPool,
        schedule: "Mon-Wed-Fri 4PM-5PM",
        defaultFee: std === "10th" ? 35000 : 30000,
      });

      const batchB = await Batch.create({
        name: `B`,
        standard: std,
        subjects: subjectsPool,
        schedule: "Tue-Thu-Sat 5PM-6PM",
        defaultFee: std === "10th" ? 30000 : 25000,
      });

      batchesData.push(batchA, batchB);
    }

    // Create Students & Records per Batch
    for (let b of batchesData) {
      const studentsInBatch = [];
      for (let i = 1; i <= 3; i++) {
        const student = await User.create({
          name: `${b.standard} Student ${b.name}${i}`,
          email: `student${b.standard.replace("th", "")}b${b.name.toLowerCase()}${i}@institute.edu`,
          password: hashedStudentPass,
          plainPassword: "student123",
          role: "student",
          standard: b.standard,
          batch: b._id,
          fatherContact: "9876543210",
          motherContact: "9876543211",
          totalFees: b.defaultFee,
          subjects: b.subjects,
          feesPaid: i === 1 ? b.defaultFee : 0, // First student paid in full
          feeHistory: i === 1 ? [{ amount: b.defaultFee, date: new Date(new Date().setDate(new Date().getDate() - 1)), method: 'Bank Transfer' }] : []
        });
        studentsInBatch.push(student);
      }

      // Attendance (1 present, 1 late, 1 absent just as an example)
      await Attendance.create({
        date: new Date(),
        batch: b._id,
        records: [
          { student: studentsInBatch[0]._id, status: "present" },
          { student: studentsInBatch[1]._id, status: "late" },
          { student: studentsInBatch[2]._id, status: "absent" },
        ],
      });

      // Marksheet (Random scores)
      await Marksheet.create({
        title: "Midterm Exam",
        subject: b.subjects[0],
        date: new Date(),
        batch: b._id,
        records: [
          {
            student: studentsInBatch[0]._id,
            marksObtained: 95,
            totalMarks: 100,
            isAbsent: false,
            remarks: "Excellent",
          },
          {
            student: studentsInBatch[1]._id,
            marksObtained: 72,
            totalMarks: 100,
            isAbsent: false,
            remarks: "Good effort",
          },
          {
            student: studentsInBatch[2]._id,
            marksObtained: 0,
            totalMarks: 100,
            isAbsent: true,
            remarks: "Absent",
          },
        ],
      });
    }

    console.log("Generated Rich Dummy Data Successfully!");
    console.log("Admin: admin@institute.edu / admin123");
    console.log("Example Student: student10ba1@institute.edu / student123");

    mongoose.disconnect();
  })
  .catch((err) => console.error(err));
