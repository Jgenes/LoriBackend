const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true }, // Reference to the Order model
  invoiceNumber: { type: String, unique: true, required: true }, // Unique invoice number
  issueDate: { type: Date, default: Date.now }, // Date the invoice is issued
  dueDate: { type: Date, required: true }, // Due date for payment
  totalAmount: { type: Number, required: true }, // Total amount for the invoice
  status: { type: String, enum: ['Pending', 'Paid', 'Overdue'], default: 'Pending' }, // Invoice status
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model('Invoice', invoiceSchema);