const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  plainPassword: { type: String },
  role: { type: String, enum: ['admin', 'manager', 'student'], default: 'student' },
  // Admin-specific
  institutionName: { type: String },
  // Student-specific
  standard: { type: String },
  batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch' },
  fatherContact: { type: String },
  motherContact: { type: String },
  totalFees: { type: Number, default: 0 },
  feesPaid: { type: Number, default: 0 },
  subjects: { type: [String], default: ["Maths", "Science", "English", "Social Studies"] },
  feeHistory: [{
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    method: { type: String, default: 'Cash' }
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
