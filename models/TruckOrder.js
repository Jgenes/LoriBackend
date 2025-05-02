const mongoose = require('mongoose');

const truckOrderSchema = new mongoose.Schema({
  truck: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true }, // Reference to the Vehicle model
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true }, // Reference to the Driver model
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true }, // Reference to the Order model
  departureDate: { type: Date, required: true }, // Departure date of the truck
  arrivalDate: { type: Date }, // Arrival date of the truck
  status: { type: String, enum: ['Pending', 'In Transit', 'Completed', 'Cancelled'], default: 'Pending' }, // Status of the truck order
  loadCapacity: { type: Number, required: true }, // Load capacity of the truck in kilograms or tons
  route: { type: String, required: true }, // Route of the truck order
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model('TruckOrder', truckOrderSchema);