const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  registration: {
    horse: { type: String, required: true }, // Registration for the horse
    trailer: { type: String, required: true }, // Registration for the trailer
  },
  make: { type: String, required: true }, // Vehicle make
  model: { type: String, required: true }, // Vehicle model
  yearManufacture: { type: Number, required: true }, // Year of manufacture
  assignedDriver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' }, // Reference to the Driver model
  licenses: [{ type: String }], // Array of licenses (e.g., operating licenses)
  registrationCardImage: { type: String }, // Path to the registration card image
  initialKilometers: { type: Number, required: true }, // Initial kilometers on the vehicle
  status: { type: String, enum: ['Active', 'Inactive', 'Under Maintenance'], default: 'Active' }, // Vehicle status
  modeOfPurchase: { type: String, enum: ['Lease', 'Purchase'], required: true }, // Mode of purchase
  purchaseAmount: { type: Number, required: true }, // Purchase amount
  truckAvailability: { type: Boolean, default: true }, // Truck availability (true = available, false = unavailable)
  owner: { type: String, required: true }, // Owner of the vehicle
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model('Vehicle', vehicleSchema);