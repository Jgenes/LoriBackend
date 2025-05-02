const express = require('express');
const { protect } = require('../middleware/authMiddleware'); // Middleware to protect routes
const CarLicense = require('../models/CarLicense'); // CarLicense model
const Vehicle = require('../models/Vehicle'); // Vehicle model

const router = express.Router();

// Add a new car license
router.post('/car-licenses', protect, async (req, res) => {
  const { name, startDate, endDate, licenseNo, status, vehicle } = req.body;

  try {
    // Ensure the vehicle exists
    const existingVehicle = await Vehicle.findById(vehicle);
    if (!existingVehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Create a new car license
    const newCarLicense = new CarLicense({
      name,
      startDate,
      endDate,
      licenseNo,
      status,
      vehicle,
    });

    await newCarLicense.save();

    res.status(201).json({ message: 'Car license added successfully', carLicense: newCarLicense });
  } catch (error) {
    console.error('Error adding car license:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a car license
router.put('/car-licenses/:id', protect, async (req, res) => {
  const { id } = req.params;
  const { name, startDate, endDate, licenseNo, status, vehicle } = req.body;

  try {
    // Ensure the vehicle exists if it's being updated
    if (vehicle) {
      const existingVehicle = await Vehicle.findById(vehicle);
      if (!existingVehicle) {
        return res.status(404).json({ message: 'Vehicle not found' });
      }
    }

    // Find the car license by ID and update
    const updatedCarLicense = await CarLicense.findByIdAndUpdate(
      id,
      { name, startDate, endDate, licenseNo, status, vehicle },
      { new: true, runValidators: true }
    );

    if (!updatedCarLicense) {
      return res.status(404).json({ message: 'Car license not found' });
    }

    res.status(200).json({ message: 'Car license updated successfully', carLicense: updatedCarLicense });
  } catch (error) {
    console.error('Error updating car license:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a car license
router.delete('/car-licenses/:id', protect, async (req, res) => {
  const { id } = req.params;

  try {
    // Find the car license by ID and delete
    const deletedCarLicense = await CarLicense.findByIdAndDelete(id);

    if (!deletedCarLicense) {
      return res.status(404).json({ message: 'Car license not found' });
    }

    res.status(200).json({ message: 'Car license deleted successfully' });
  } catch (error) {
    console.error('Error deleting car license:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// View a specific car license
router.get('/car-licenses/:id', protect, async (req, res) => {
  const { id } = req.params;

  try {
    // Find the car license by ID
    const carLicense = await CarLicense.findById(id).populate('vehicle'); // Populate vehicle details

    if (!carLicense) {
      return res.status(404).json({ message: 'Car license not found' });
    }

    res.status(200).json({ message: 'Car license retrieved successfully', carLicense });
  } catch (error) {
    console.error('Error retrieving car license:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// View all car licenses
router.get('/car-licenses', protect, async (req, res) => {
  try {
    // Fetch all car licenses
    const carLicenses = await CarLicense.find().populate('vehicle'); // Populate vehicle details

    res.status(200).json({ message: 'Car licenses retrieved successfully', carLicenses });
  } catch (error) {
    console.error('Error retrieving car licenses:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;