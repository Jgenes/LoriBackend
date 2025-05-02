const mongoose = require('mongoose');

const financialReportSchema = new mongoose.Schema({
  startDate: { type: Date, required: true }, // Start date of the report period
  endDate: { type: Date, required: true }, // End date of the report period
  totalIncome: { type: Number, required: true }, // Total income for the period
  totalExpenditures: { type: Number, required: true }, // Total expenditures for the period
  netProfit: { type: Number, required: true }, // Net profit (income - expenditures)
  generatedAt: { type: Date, default: Date.now }, // Date the report was generated
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model('FinancialReport', financialReportSchema);