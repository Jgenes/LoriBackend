const mongoose = require('mongoose');

const scheduledReportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true }, // Reference to the Vehicle model
  frequency: { type: String, enum: ['Daily', 'Weekly', 'Monthly'], required: true }, // Frequency of the report
  nextReportDate: { type: Date, required: true }, // Date for the next report
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model('ScheduledReport', scheduledReportSchema);