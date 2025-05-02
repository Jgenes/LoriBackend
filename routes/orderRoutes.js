const express = require('express');
const { protect } = require('../middleware/authMiddleware'); // Middleware to protect routes
const Order = require('../models/Order'); // Order model
const Customer = require('../models/Customer'); // Customer model
const TruckOrder = require('../models/TruckOrder'); // TruckOrder model
const SubOrder = require('../models/SubOrder'); // SubOrder model

const router = express.Router();

// Add a new order
router.post('/orders', protect, async (req, res) => {
  const { customer, truckOrder, tripNo, totalQuantity, subOrders } = req.body;

  try {
    // Ensure the customer exists
    const existingCustomer = await Customer.findById(customer);
    if (!existingCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Ensure the truck order exists
    const existingTruckOrder = await TruckOrder.findById(truckOrder);
    if (!existingTruckOrder) {
      return res.status(404).json({ message: 'Truck order not found' });
    }

    // Ensure all sub-orders exist
    if (subOrders && subOrders.length > 0) {
      for (const subOrderId of subOrders) {
        const existingSubOrder = await SubOrder.findById(subOrderId);
        if (!existingSubOrder) {
          return res.status(404).json({ message: `Sub-order with ID ${subOrderId} not found` });
        }
      }
    }

    // Create a new order
    const newOrder = new Order({
      customer,
      truckOrder,
      tripNo,
      totalQuantity,
      subOrders,
    });

    await newOrder.save();

    res.status(201).json({ message: 'Order added successfully', order: newOrder });
  } catch (error) {
    console.error('Error adding order:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update an order
router.put('/orders/:id', protect, async (req, res) => {
  const { id } = req.params;
  const { customer, truckOrder, tripNo, totalQuantity, subOrders } = req.body;

  try {
    // Ensure the customer exists if being updated
    if (customer) {
      const existingCustomer = await Customer.findById(customer);
      if (!existingCustomer) {
        return res.status(404).json({ message: 'Customer not found' });
      }
    }

    // Ensure the truck order exists if being updated
    if (truckOrder) {
      const existingTruckOrder = await TruckOrder.findById(truckOrder);
      if (!existingTruckOrder) {
        return res.status(404).json({ message: 'Truck order not found' });
      }
    }

    // Ensure all sub-orders exist if being updated
    if (subOrders && subOrders.length > 0) {
      for (const subOrderId of subOrders) {
        const existingSubOrder = await SubOrder.findById(subOrderId);
        if (!existingSubOrder) {
          return res.status(404).json({ message: `Sub-order with ID ${subOrderId} not found` });
        }
      }
    }

    // Find the order by ID and update
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { customer, truckOrder, tripNo, totalQuantity, subOrders },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order updated successfully', order: updatedOrder });
  } catch (error) {
    console.error('Error updating order:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete an order
router.delete('/orders/:id', protect, async (req, res) => {
  const { id } = req.params;

  try {
    // Find the order by ID and delete
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// View a specific order
router.get('/orders/:id', protect, async (req, res) => {
  const { id } = req.params;

  try {
    // Find the order by ID
    const order = await Order.findById(id)
      .populate('customer') // Populate customer details
      .populate('truckOrder') // Populate truck order details
      .populate('subOrders'); // Populate sub-order details

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order retrieved successfully', order });
  } catch (error) {
    console.error('Error retrieving order:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// View all orders
router.get('/orders', protect, async (req, res) => {
  try {
    // Fetch all orders
    const orders = await Order.find()
      .populate('customer') // Populate customer details
      .populate('truckOrder') // Populate truck order details
      .populate('subOrders'); // Populate sub-order details

    res.status(200).json({ message: 'Orders retrieved successfully', orders });
  } catch (error) {
    console.error('Error retrieving orders:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;