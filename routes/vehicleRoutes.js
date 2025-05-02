const express = require('express');
const { protect } = require('../middleware/authMiddleware'); // Middleware to protect routes
const Vehicle = require('../models/Vehicle'); // Vehicle model
const upload = require('../middleware/uploadMiddleware'); // Multer middleware for file uploads

const router = express.Router();

// Add a new vehicle
router.post('/vehicles', protect, upload.single('registrationCardImage'), async (req, res) => {
  const { registration, make, model, yearManufacture, assignedDriver, licenses, initialKilometers, status, modeOfPurchase, purchaseAmount, truckAvailability, owner } = req.body;

  try {
    // Create a new vehicle
    const newVehicle = new Vehicle({
      registration: JSON.parse(registration), // Parse registration if sent as a JSON string
      make,
      model,
      yearManufacture,
      assignedDriver,
      licenses: licenses ? JSON.parse(licenses) : [], // Parse licenses if sent as a JSON string
      registrationCardImage: req.file ? req.file.path : null, // Path to the uploaded registration card image
      initialKilometers,
      status,
      modeOfPurchase,
      purchaseAmount,
      truckAvailability,
      owner,
    });

    await newVehicle.save();

    res.status(201).json({ message: 'Vehicle added successfully', vehicle: newVehicle });
  } catch (error) {
    console.error('Error adding vehicle:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a vehicle
router.put('/vehicles/:id', protect, upload.single('registrationCardImage'), async (req, res) => {
  const { id } = req.params;
  const { registration, make, model, yearManufacture, assignedDriver, licenses, initialKilometers, status, modeOfPurchase, purchaseAmount, truckAvailability, owner } = req.body;

  try {
    // Find the vehicle by ID and update
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      id,
      {
        registration: registration ? JSON.parse(registration) : undefined,
        make,
        model,
        yearManufacture,
        assignedDriver,
        licenses: licenses ? JSON.parse(licenses) : undefined,
        registrationCardImage: req.file ? req.file.path : undefined,
        initialKilometers,
        status,
        modeOfPurchase,
        purchaseAmount,
        truckAvailability,
        owner,
      },
      { new: true, runValidators: true }
    );

    if (!updatedVehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.status(200).json({ message: 'Vehicle updated successfully', vehicle: updatedVehicle });
  } catch (error) {
    console.error('Error updating vehicle:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a vehicle
router.delete('/vehicles/:id', protect, async (req, res) => {
  const { id } = req.params;

  try {
    // Find the vehicle by ID and delete
    const deletedVehicle = await Vehicle.findByIdAndDelete(id);

    if (!deletedVehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error('Error deleting vehicle:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// View a specific vehicle
router.get('/vehicles/:id', protect, async (req, res) => {
  const { id } = req.params;

  try {
    // Find the vehicle by ID
    const vehicle = await Vehicle.findById(id).populate('assignedDriver'); // Populate assigned driver details

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.status(200).json({ message: 'Vehicle retrieved successfully', vehicle });
  } catch (error) {
    console.error('Error retrieving vehicle:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// View all vehicles
router.get('/vehicles', protect, async (req, res) => {
  try {
    // Fetch all vehicles
    const vehicles = await Vehicle.find().populate('assignedDriver'); // Populate assigned driver details

    res.status(200).json({ message: 'Vehicles retrieved successfully', vehicles });
  } catch (error) {
    console.error('Error retrieving vehicles:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;