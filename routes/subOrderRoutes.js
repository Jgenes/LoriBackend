const express = require('express');
const { protect } = require('../middleware/authMiddleware'); // Middleware to protect routes
const SubOrder = require('../models/SubOrder'); // SubOrder model
const Driver = require('../models/Driver'); // Driver model
const Vehicle = require('../models/Vehicle'); // Vehicle model
const Product = require('../models/Product'); // Product model

const router = express.Router();

// Add a new sub-order
router.post('/sub-orders', protect, async (req, res) => {
  const { driver, vehicle, loadingDate, loadingPoint, product, productLoss, deliveryDate, quantity } = req.body;

  try {
    // Ensure the driver exists
    const existingDriver = await Driver.findById(driver);
    if (!existingDriver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    // Ensure the vehicle exists
    const existingVehicle = await Vehicle.findById(vehicle);
    if (!existingVehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Ensure the product exists
    const existingProduct = await Product.findById(product);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Create a new sub-order
    const newSubOrder = new SubOrder({
      driver,
      vehicle,
      loadingDate,
      loadingPoint,
      product,
      productLoss,
      deliveryDate,
      quantity,
    });

    await newSubOrder.save();

    res.status(201).json({ message: 'Sub-order added successfully', subOrder: newSubOrder });
  } catch (error) {
    console.error('Error adding sub-order:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a sub-order
router.put('/sub-orders/:id', protect, async (req, res) => {
  const { id } = req.params;
  const { driver, vehicle, loadingDate, loadingPoint, product, productLoss, deliveryDate, quantity } = req.body;

  try {
    // Ensure the driver exists if being updated
    if (driver) {
      const existingDriver = await Driver.findById(driver);
      if (!existingDriver) {
        return res.status(404).json({ message: 'Driver not found' });
      }
    }

    // Ensure the vehicle exists if being updated
    if (vehicle) {
      const existingVehicle = await Vehicle.findById(vehicle);
      if (!existingVehicle) {
        return res.status(404).json({ message: 'Vehicle not found' });
      }
    }

    // Ensure the product exists if being updated
    if (product) {
      const existingProduct = await Product.findById(product);
      if (!existingProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
    }

    // Find the sub-order by ID and update
    const updatedSubOrder = await SubOrder.findByIdAndUpdate(
      id,
      { driver, vehicle, loadingDate, loadingPoint, product, productLoss, deliveryDate, quantity },
      { new: true, runValidators: true }
    );

    if (!updatedSubOrder) {
      return res.status(404).json({ message: 'Sub-order not found' });
    }

    res.status(200).json({ message: 'Sub-order updated successfully', subOrder: updatedSubOrder });
  } catch (error) {
    console.error('Error updating sub-order:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a sub-order
router.delete('/sub-orders/:id', protect, async (req, res) => {
  const { id } = req.params;

  try {
    // Find the sub-order by ID and delete
    const deletedSubOrder = await SubOrder.findByIdAndDelete(id);

    if (!deletedSubOrder) {
      return res.status(404).json({ message: 'Sub-order not found' });
    }

    res.status(200).json({ message: 'Sub-order deleted successfully' });
  } catch (error) {
    console.error('Error deleting sub-order:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// View a specific sub-order
router.get('/sub-orders/:id', protect, async (req, res) => {
  const { id } = req.params;

  try {
    // Find the sub-order by ID
    const subOrder = await SubOrder.findById(id)
      .populate('driver') // Populate driver details
      .populate('vehicle') // Populate vehicle details
      .populate('product'); // Populate product details

    if (!subOrder) {
      return res.status(404).json({ message: 'Sub-order not found' });
    }

    res.status(200).json({ message: 'Sub-order retrieved successfully', subOrder });
  } catch (error) {
    console.error('Error retrieving sub-order:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// View all sub-orders
router.get('/sub-orders', protect, async (req, res) => {
  try {
    // Fetch all sub-orders
    const subOrders = await SubOrder.find()
      .populate('driver') // Populate driver details
      .populate('vehicle') // Populate vehicle details
      .populate('product'); // Populate product details

    res.status(200).json({ message: 'Sub-orders retrieved successfully', subOrders });
  } catch (error) {
    console.error('Error retrieving sub-orders:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;