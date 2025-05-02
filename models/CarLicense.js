const mongoose = require('mongoose');

const carLicenseSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the license
  startDate: { type: Date, required: true }, // Start date of the license
  endDate: { type: Date, required: true }, // End date of the license
  licenseNo: { type: String, required: true, unique: true }, // Unique license number
  status: { type: String, enum: ['Active', 'Expired', 'Suspended'], default: 'Active' }, // License status
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true }, // Reference to the Vehicle model
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model('CarLicense', carLicenseSchema);