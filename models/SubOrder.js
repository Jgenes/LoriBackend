const mongoose = require('mongoose');

const subOrderSchema = new mongoose.Schema({
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true }, // Reference to the Driver model
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true }, // Reference to the Vehicle model
  loadingDate: { type: Date, required: true }, // Date when the loading occurs
  loadingPoint: { type: String, required: true }, // Loading point location
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Reference to the Product model
  productLoss: { type: Number, default: 0 }, // Product loss during transportation
  deliveryDate: { type: Date, required: true }, // Delivery date
  quantity: { type: Number, required: true }, // Quantity of the product being transported
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model('SubOrder', subOrderSchema);