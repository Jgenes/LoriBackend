const mongoose = require('mongoose');

// Function to generate a unique trip code
const generateTripCode = () => {
  return `Trip-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

const orderSchema = new mongoose.Schema({
  tripCode: { type: String, default: generateTripCode, unique: true }, // Automatically generated trip code
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true }, // Reference to the Customer table
  truckOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'TruckOrder', required: true }, // Reference to the TruckOrder table
  tripNo: { type: String, required: true, unique: true }, // Unique trip number
  totalQuantity: { type: Number, required: true }, // Total quantity for the order
  subOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubOrder' }], // Array of references to SubOrder table
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model('Order', orderSchema);