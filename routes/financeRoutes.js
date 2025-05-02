const express = require('express');
const { protect } = require('../middleware/authMiddleware'); // Middleware to protect routes
const Expenditure = require('../models/Expenditure'); // Expenditure model
const FinancialReport = require('../models/FinancialReport'); // Financial Report model
const Invoice = require('../models/Invoice'); // Invoice model
const Order = require('../models/Order'); // Order model
const Vehicle = require('../models/Vehicle'); // Vehicle model

const router = express.Router();

// Log an expenditure
router.post('/expenditures', protect, async (req, res) => {
  const { truck, order, description, amount, category } = req.body;

  try {
    // Ensure the truck exists
    const existingTruck = await Vehicle.findById(truck);
    if (!existingTruck) {
      return res.status(404).json({ message: 'Truck not found' });
    }

    // Ensure the order exists if provided
    if (order) {
      const existingOrder = await Order.findById(order);
      if (!existingOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }
    }

    // Create a new expenditure
    const newExpenditure = new Expenditure({
      truck,
      order,
      description,
      amount,
      category,
    });

    await newExpenditure.save();

    res.status(201).json({ message: 'Expenditure logged successfully', expenditure: newExpenditure });
  } catch (error) {
    console.error('Error logging expenditure:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Compare order profitability
router.get('/orders/:id/profitability', protect, async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the order and associated expenditures
    const order = await Order.findById(id);
    const expenditures = await Expenditure.find({ order: id });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Calculate total expenditures
    const totalExpenditures = expenditures.reduce((sum, exp) => sum + exp.amount, 0);

    // Calculate profitability
    const profitability = order.totalQuantity * 100 - totalExpenditures; // Example: price per unit is 100

    res.status(200).json({
      message: 'Order profitability calculated successfully',
      orderId: id,
      totalIncome: order.totalQuantity * 100,
      totalExpenditures,
      profitability,
    });
  } catch (error) {
    console.error('Error calculating profitability:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate financial report
router.post('/financial-report', protect, async (req, res) => {
  const { startDate, endDate } = req.body;

  try {
    // Fetch all invoices and expenditures within the period
    const invoices = await Invoice.find({ issueDate: { $gte: startDate, $lte: endDate } });
    const expenditures = await Expenditure.find({ date: { $gte: startDate, $lte: endDate } });

    // Calculate totals
    const totalIncome = invoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0);
    const totalExpenditures = expenditures.reduce((sum, exp) => sum + exp.amount, 0);
    const netProfit = totalIncome - totalExpenditures;

    // Create a financial report
    const newReport = new FinancialReport({
      startDate,
      endDate,
      totalIncome,
      totalExpenditures,
      netProfit,
    });

    await newReport.save();

    res.status(201).json({ message: 'Financial report generated successfully', report: newReport });
  } catch (error) {
    console.error('Error generating financial report:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// View all financial reports
router.get('/financial-reports', protect, async (req, res) => {
  try {
    const reports = await FinancialReport.find();

    res.status(200).json({ message: 'Financial reports retrieved successfully', reports });
  } catch (error) {
    console.error('Error retrieving financial reports:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;