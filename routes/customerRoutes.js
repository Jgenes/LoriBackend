const express = require('express');
const { protect } = require('../middleware/authMiddleware'); // Middleware to protect routes
const Customer = require('../models/Customer'); // Customer model

const router = express.Router();

// Add a new customer
router.post('/customers', protect, async (req, res) => {
  const { name, email, address, phone, status, companyName, incomeGenerated } = req.body;

  try {
    // Create a new customer
    const newCustomer = new Customer({
      name,
      email,
      address,
      phone,
      status,
      companyName,
      incomeGenerated,
    });

    await newCustomer.save();

    res.status(201).json({ message: 'Customer added successfully', customer: newCustomer });
  } catch (error) {
    console.error('Error adding customer:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a customer
router.put('/customers/:id', protect, async (req, res) => {
  const { id } = req.params;
  const { name, email, address, phone, status, companyName, incomeGenerated } = req.body;

  try {
    // Find the customer by ID and update
    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      { name, email, address, phone, status, companyName, incomeGenerated },
      { new: true, runValidators: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({ message: 'Customer updated successfully', customer: updatedCustomer });
  } catch (error) {
    console.error('Error updating customer:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a customer
router.delete('/customers/:id', protect, async (req, res) => {
  const { id } = req.params;

  try {
    // Find the customer by ID and delete
    const deletedCustomer = await Customer.findByIdAndDelete(id);

    if (!deletedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error deleting customer:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// View a specific customer
router.get('/customers/:id', protect, async (req, res) => {
  const { id } = req.params;

  try {
    // Find the customer by ID
    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({ message: 'Customer retrieved successfully', customer });
  } catch (error) {
    console.error('Error retrieving customer:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// View all customers
router.get('/customers', protect, async (req, res) => {
  try {
    // Fetch all customers
    const customers = await Customer.find();

    res.status(200).json({ message: 'Customers retrieved successfully', customers });
  } catch (error) {
    console.error('Error retrieving customers:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;