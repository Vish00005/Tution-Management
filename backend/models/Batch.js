const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  standard: { type: String, required: true },
  subjects: [{ type: String }],
  schedule: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Batch', batchSchema);
