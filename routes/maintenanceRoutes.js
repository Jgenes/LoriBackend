const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const Maintenance = require('../models/Maintenance');
const Vehicle = require('../models/Vehicle');
const sendEmail = require('../utils/emailSender'); // Import the email sender utility

const router = express.Router();

// Log maintenance or repair
router.post('/maintenance', protect, async (req, res) => {
  const { vehicle, description, cost, parts, mechanic, nextServiceDate } = req.body;

  try {
    // Ensure the vehicle exists
    const existingVehicle = await Vehicle.findById(vehicle);
    if (!existingVehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Create a new maintenance record
    const newMaintenance = new Maintenance({
      vehicle,
      description,
      cost,
      parts,
      mechanic,
      nextServiceDate,
    });

    await newMaintenance.save();

    res.status(201).json({ message: 'Maintenance logged successfully', maintenance: newMaintenance });
  } catch (error) {
    console.error('Error logging maintenance:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// View maintenance history for a vehicle
router.get('/maintenance/:vehicleId', protect, async (req, res) => {
  const { vehicleId } = req.params;

  try {
    // Fetch maintenance records for the vehicle
    const maintenanceRecords = await Maintenance.find({ vehicle: vehicleId });

    if (!maintenanceRecords.length) {
      return res.status(404).json({ message: 'No maintenance records found for this vehicle' });
    }

    res.status(200).json({ message: 'Maintenance records retrieved successfully', maintenanceRecords });
  } catch (error) {
    console.error('Error retrieving maintenance records:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Schedule periodic service
router.post('/maintenance/schedule', protect, async (req, res) => {
  const { vehicle, nextServiceDate } = req.body;

  try {
    // Ensure the vehicle exists
    const existingVehicle = await Vehicle.findById(vehicle);
    if (!existingVehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Update the next service date for the vehicle
    const maintenance = new Maintenance({
      vehicle,
      description: 'Scheduled periodic service',
      cost: 0,
      parts: [],
      mechanic: 'N/A',
      nextServiceDate,
    });

    await maintenance.save();

    res.status(201).json({ message: 'Periodic service scheduled successfully', maintenance });
  } catch (error) {
    console.error('Error scheduling periodic service:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send reminders for overdue services
router.get('/maintenance/reminders', protect, async (req, res) => {
  try {
    // Fetch vehicles with overdue services
    const overdueServices = await Maintenance.find({ nextServiceDate: { $lte: new Date() } }).populate('vehicle');

    if (!overdueServices.length) {
      return res.status(200).json({ message: 'No overdue services found' });
    }

    // Send email reminders
    overdueServices.forEach(async (service) => {
      const emailText = `
        Reminder: Vehicle ${service.vehicle._id} (${service.vehicle.name}) is overdue for service.
        Last Maintenance: ${service.date.toDateString()}
        Next Service Date: ${service.nextServiceDate.toDateString()}
        Please schedule the service as soon as possible.
      `;

      // Replace with the driver's or mechanic's email
      const recipientEmail = 'mechanic@example.com'; // Replace with actual email logic
      await sendEmail(recipientEmail, 'Vehicle Service Reminder', emailText);
    });

    res.status(200).json({ message: 'Reminders sent successfully', overdueServices });
  } catch (error) {
    console.error('Error sending reminders:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Calculate total maintenance cost for a vehicle
router.get('/maintenance/:vehicleId/cost', protect, async (req, res) => {
  const { vehicleId } = req.params;

  try {
    // Fetch maintenance records for the vehicle
    const maintenanceRecords = await Maintenance.find({ vehicle: vehicleId });

    if (!maintenanceRecords.length) {
      return res.status(404).json({ message: 'No maintenance records found for this vehicle' });
    }

    // Calculate total cost
    const totalCost = maintenanceRecords.reduce((sum, record) => sum + record.cost, 0);

    res.status(200).json({ message: 'Total maintenance cost calculated successfully', totalCost });
  } catch (error) {
    console.error('Error calculating maintenance cost:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;