const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the product
  description: { type: String }, // Description of the product
  price: { type: Number, required: true }, // Price of the product
  category: { type: String, required: true }, // Category of the product
  stock: { type: Number, required: true }, // Stock quantity available
  status: { type: String, enum: ['Available', 'Out of Stock'], default: 'Available' }, // Product availability status
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model('Product', productSchema);