const express = require('express');
const { protect } = require('../middleware/authMiddleware'); // Middleware to protect routes
const Driver = require('../models/Driver'); // Driver model
const upload = require('../middleware/uploadMiddleware'); // Multer middleware for file uploads

const router = express.Router();

// Add a new driver
router.post('/drivers', protect, upload.fields([
  { name: 'licenseFront', maxCount: 1 },
  { name: 'licenseBack', maxCount: 1 },
  { name: 'passportFront', maxCount: 1 },
  { name: 'passportBack', maxCount: 1 },
  { name: 'nationalIDFront', maxCount: 1 },
  { name: 'nationalIDBack', maxCount: 1 },
]), async (req, res) => {
  const { name, drivingLicenseNumber, phoneNumber, residentAddress, vehicle, nationalIDNumber, status, passportNumber, gender } = req.body;

  try {
    // Create a new driver associated with the logged-in user's company
    const newDriver = new Driver({
      name,
      drivingLicenseNumber,
      licenseImages: {
        front: req.files.licenseFront ? req.files.licenseFront[0].path : null,
        back: req.files.licenseBack ? req.files.licenseBack[0].path : null,
      },
      phoneNumber,
      residentAddress: JSON.parse(residentAddress), // Parse residentAddress if sent as a JSON string
      vehicle,
      nationalIDNumber,
      status,
      passportNumber,
      gender,
      passportImages: {
        front: req.files.passportFront ? req.files.passportFront[0].path : null,
        back: req.files.passportBack ? req.files.passportBack[0].path : null,
      },
      nationalIDImages: {
        front: req.files.nationalIDFront ? req.files.nationalIDFront[0].path : null,
        back: req.files.nationalIDBack ? req.files.nationalIDBack[0].path : null,
      },
      company: req.user.company, // Associate the driver with the logged-in user's company
    });

    await newDriver.save();

    res.status(201).json({ message: 'Driver added successfully', driver: newDriver });
  } catch (error) {
    console.error('Error adding driver:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a driver
router.put('/drivers/:id', protect, upload.fields([
  { name: 'licenseFront', maxCount: 1 },
  { name: 'licenseBack', maxCount: 1 },
  { name: 'passportFront', maxCount: 1 },
  { name: 'passportBack', maxCount: 1 },
  { name: 'nationalIDFront', maxCount: 1 },
  { name: 'nationalIDBack', maxCount: 1 },
]), async (req, res) => {
  const { id } = req.params;
  const { name, drivingLicenseNumber, phoneNumber, residentAddress, vehicle, nationalIDNumber, status, passportNumber, gender } = req.body;

  try {
    // Find the driver by ID and update
    const updatedDriver = await Driver.findByIdAndUpdate(
      id,
      {
        name,
        drivingLicenseNumber,
        licenseImages: {
          front: req.files.licenseFront ? req.files.licenseFront[0].path : undefined,
          back: req.files.licenseBack ? req.files.licenseBack[0].path : undefined,
        },
        phoneNumber,
        residentAddress: JSON.parse(residentAddress), // Parse residentAddress if sent as a JSON string
        vehicle,
        nationalIDNumber,
        status,
        passportNumber,
        gender,
        passportImages: {
          front: req.files.passportFront ? req.files.passportFront[0].path : undefined,
          back: req.files.passportBack ? req.files.passportBack[0].path : undefined,
        },
        nationalIDImages: {
          front: req.files.nationalIDFront ? req.files.nationalIDFront[0].path : undefined,
          back: req.files.nationalIDBack ? req.files.nationalIDBack[0].path : undefined,
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedDriver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.status(200).json({ message: 'Driver updated successfully', driver: updatedDriver });
  } catch (error) {
    console.error('Error updating driver:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a driver
router.delete('/drivers/:id', protect, async (req, res) => {
  const { id } = req.params;

  try {
    // Find the driver by ID and delete
    const deletedDriver = await Driver.findByIdAndDelete(id);

    if (!deletedDriver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.status(200).json({ message: 'Driver deleted successfully' });
  } catch (error) {
    console.error('Error deleting driver:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// View a specific driver
router.get('/drivers/:id', protect, async (req, res) => {
  const { id } = req.params;

  try {
    // Find the driver by ID
    const driver = await Driver.findById(id).populate('vehicle'); // Populate vehicle details

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.status(200).json({ message: 'Driver retrieved successfully', driver });
  } catch (error) {
    console.error('Error retrieving driver:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// View all drivers
router.get('/drivers', protect, async (req, res) => {
  try {
    // Fetch all drivers associated with the logged-in user's company
    const drivers = await Driver.find({ company: req.user.company }).populate('vehicle');

    res.status(200).json({ message: 'Drivers retrieved successfully', drivers });
  } catch (error) {
    console.error('Error retrieving drivers:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;