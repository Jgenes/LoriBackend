const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const Location = require('../models/Location');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');

const router = express.Router();

// Update vehicle location
router.post('/location', protect, async (req, res) => {
  const { vehicle, driver, latitude, longitude } = req.body;

  try {
    // Ensure the vehicle exists
    const existingVehicle = await Vehicle.findById(vehicle);
    if (!existingVehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Ensure the driver exists
    const existingDriver = await Driver.findById(driver);
    if (!existingDriver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    // Save the location update
    const newLocation = new Location({
      vehicle,
      driver,
      latitude,
      longitude,
    });

    await newLocation.save();

    res.status(201).json({ message: 'Location updated successfully', location: newLocation });
  } catch (error) {
    console.error('Error updating location:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch the latest location of a vehicle
router.get('/location/:vehicleId', protect, async (req, res) => {
  const { vehicleId } = req.params;

  try {
    // Fetch the latest location for the vehicle
    const latestLocation = await Location.findOne({ vehicle: vehicleId }).sort({ timestamp: -1 });

    if (!latestLocation) {
      return res.status(404).json({ message: 'No location data found for this vehicle' });
    }

    res.status(200).json({ message: 'Latest location retrieved successfully', location: latestLocation });
  } catch (error) {
    console.error('Error retrieving location:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Report a vehicle breakdown
router.post('/breakdown', protect, async (req, res) => {
  const { vehicle, driver, description } = req.body;

  try {
    // Ensure the vehicle exists
    const existingVehicle = await Vehicle.findById(vehicle);
    if (!existingVehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Save the breakdown report
    const breakdown = {
      vehicle,
      driver,
      description,
      timestamp: new Date(),
    };

    // Example: Log the breakdown (you can save it to a database or send notifications)
    console.log('Breakdown reported:', breakdown);

    res.status(201).json({ message: 'Breakdown reported successfully', breakdown });
  } catch (error) {
    console.error('Error reporting breakdown:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch the latest location of a vehicle
const fetchVehicleLocation = async (vehicleId) => {
  try {
    const response = await fetch(`/api/location/${vehicleId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${yourAuthToken}`, // Replace with your token
      },
    });
    const data = await response.json();
    if (response.ok) {
      return data.location; // Returns the latest location
    } else {
      console.error(data.message);
    }
  } catch (error) {
    console.error('Error fetching vehicle location:', error.message);
  }
};

module.exports = router;