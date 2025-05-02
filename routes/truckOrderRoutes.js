const express = require('express');
const { protect } = require('../middleware/authMiddleware'); // Middleware to protect routes
const TruckOrder = require('../models/TruckOrder'); // TruckOrder model
const Vehicle = require('../models/Vehicle'); // Vehicle model
const Driver = require('../models/Driver'); // Driver model
const Order = require('../models/Order'); // Order model

const router = express.Router();

// Add a new truck order
router.post('/truck-orders', protect, async (req, res) => {
  const { truck, driver, order, departureDate, arrivalDate, status, loadCapacity, route } = req.body;

  try {
    // Ensure the truck exists
    const existingTruck = await Vehicle.findById(truck);
    if (!existingTruck) {
      return res.status(404).json({ message: 'Truck not found' });
    }

    // Ensure the driver exists
    const existingDriver = await Driver.findById(driver);
    if (!existingDriver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    // Ensure the order exists
    const existingOrder = await Order.findById(order);
    if (!existingOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Create a new truck order
    const newTruckOrder = new TruckOrder({
      truck,
      driver,
      order,
      departureDate,
      arrivalDate,
      status,
      loadCapacity,
      route,
    });

    await newTruckOrder.save();

    res.status(201).json({ message: 'Truck order added successfully', truckOrder: newTruckOrder });
  } catch (error) {
    console.error('Error adding truck order:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a truck order
router.put('/truck-orders/:id', protect, async (req, res) => {
  const { id } = req.params;
  const { truck, driver, order, departureDate, arrivalDate, status, loadCapacity, route } = req.body;

  try {
    // Ensure the truck exists if being updated
    if (truck) {
      const existingTruck = await Vehicle.findById(truck);
      if (!existingTruck) {
        return res.status(404).json({ message: 'Truck not found' });
      }
    }

    // Ensure the driver exists if being updated
    if (driver) {
      const existingDriver = await Driver.findById(driver);
      if (!existingDriver) {
        return res.status(404).json({ message: 'Driver not found' });
      }
    }

    // Ensure the order exists if being updated
    if (order) {
      const existingOrder = await Order.findById(order);
      if (!existingOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }
    }

    // Find the truck order by ID and update
    const updatedTruckOrder = await TruckOrder.findByIdAndUpdate(
      id,
      { truck, driver, order, departureDate, arrivalDate, status, loadCapacity, route },
      { new: true, runValidators: true }
    );

    if (!updatedTruckOrder) {
      return res.status(404).json({ message: 'Truck order not found' });
    }

    res.status(200).json({ message: 'Truck order updated successfully', truckOrder: updatedTruckOrder });
  } catch (error) {
    console.error('Error updating truck order:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a truck order
router.delete('/truck-orders/:id', protect, async (req, res) => {
  const { id } = req.params;

  try {
    // Find the truck order by ID and delete
    const deletedTruckOrder = await TruckOrder.findByIdAndDelete(id);

    if (!deletedTruckOrder) {
      return res.status(404).json({ message: 'Truck order not found' });
    }

    res.status(200).json({ message: 'Truck order deleted successfully' });
  } catch (error) {
    console.error('Error deleting truck order:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// View a specific truck order
router.get('/truck-orders/:id', protect, async (req, res) => {
  const { id } = req.params;

  try {
    // Find the truck order by ID
    const truckOrder = await TruckOrder.findById(id)
      .populate('truck') // Populate truck details
      .populate('driver') // Populate driver details
      .populate('order'); // Populate order details

    if (!truckOrder) {
      return res.status(404).json({ message: 'Truck order not found' });
    }

    res.status(200).json({ message: 'Truck order retrieved successfully', truckOrder });
  } catch (error) {
    console.error('Error retrieving truck order:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// View all truck orders
router.get('/truck-orders', protect, async (req, res) => {
  try {
    // Fetch all truck orders
    const truckOrders = await TruckOrder.find()
      .populate('truck') // Populate truck details
      .populate('driver') // Populate driver details
      .populate('order'); // Populate order details

    res.status(200).json({ message: 'Truck orders retrieved successfully', truckOrders });
  } catch (error) {
    console.error('Error retrieving truck orders:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;