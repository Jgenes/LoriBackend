const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true }, // Reference to the Vehicle model
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true }, // Reference to the Driver model
  latitude: { type: Number, required: true }, // Latitude of the vehicle
  longitude: { type: Number, required: true }, // Longitude of the vehicle
  timestamp: { type: Date, default: Date.now }, // Time of the location update
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model('Location', locationSchema);