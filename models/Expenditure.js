const mongoose = require('mongoose');

const expenditureSchema = new mongoose.Schema({
  truck: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true }, // Reference to the Vehicle model
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: false }, // Reference to the Order model (optional)
  description: { type: String, required: true }, // Description of the expenditure
  amount: { type: Number, required: true }, // Amount spent
  date: { type: Date, default: Date.now }, // Date of the expenditure
  category: { type: String, enum: ['Fuel', 'Maintenance', 'Tolls', 'Wages', 'Other'], required: true }, // Category of expenditure
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model('Expenditure', expenditureSchema);