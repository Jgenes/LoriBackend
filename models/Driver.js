const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  drivingLicenseNumber: { type: String, required: true, unique: true },
  licenseImages: {
    front: { type: String, required: true },
    back: { type: String, required: true },
  },
  phoneNumber: { type: String, required: true, unique: true },
  residentAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
  },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  nationalIDNumber: { type: String, required: true, unique: true },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  passportNumber: { type: String, unique: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  passportImages: {
    front: { type: String },
    back: { type: String },
  },
  nationalIDImages: {
    front: { type: String },
    back: { type: String },
  },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true }, // Reference to the Company model
}, {
  timestamps: true,
});

module.exports = mongoose.model('Driver', driverSchema);