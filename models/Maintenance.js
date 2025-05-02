const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true }, // Reference to the Vehicle model
  description: { type: String, required: true }, // Description of the maintenance or repair
  date: { type: Date, default: Date.now }, // Date of the maintenance
  cost: { type: Number, required: true }, // Cost of the maintenance
  parts: [{ name: String, cost: Number }], // List of parts used and their costs
  mechanic: { type: String, required: true }, // Name of the mechanic or service provider
  nextServiceDate: { type: Date }, // Date for the next scheduled service
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model('Maintenance', maintenanceSchema);