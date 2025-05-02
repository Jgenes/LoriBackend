const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // For generating JWT tokens
const User = require('../models/User'); // Import the User model
const Company = require('../models/Company'); // Import the Company model
const sendEmail = require('../utils/emailSender'); // Import the email utility
const { protect } = require('../middleware/authMiddleware'); // Import the protect middleware
const upload = require('../middleware/uploadMiddleware'); // Import multer middleware

const router = express.Router();

// Temporary storage for OTPs (in-memory for simplicity; use a database in production)
const otpStore = {};

// User registration endpoint
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Validate input
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Send a welcome email
    const subject = 'Welcome to Lori Logistics!';
    const text = `Hi ${name},\n\nWelcome to Lori Logistics! We're excited to have you on board.\n\nBest regards,\nThe Lori Logistics Team`;
    await sendEmail(email, subject, text);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// User login endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate a One-Time Password (OTP)
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
    otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // Store OTP with a 5-minute expiration

    // Send the OTP to the user's email
    const subject = 'Your Lori Logistics Login OTP';
    const text = `Hi ${user.name},\n\nYour OTP for login is: ${otp}\n\nThis OTP is valid for 5 minutes.\n\nBest regards,\nThe Lori Logistics Team`;
    await sendEmail(email, subject, text);

    res.status(200).json({ message: 'OTP sent to your email. Please verify to complete login.' });
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify OTP endpoint
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Check if the OTP exists and is valid
    const storedOtp = otpStore[email];
    if (!storedOtp || storedOtp.otp !== parseInt(otp) || storedOtp.expiresAt < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // OTP is valid; generate a JWT token
    const user = await User.findOne({ email });
    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

    // Clear the OTP from the store
    delete otpStore[email];

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error verifying OTP:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a company profile (protected route)
router.post('/company', protect, upload.single('logo'), async (req, res) => {
  const { name, address, email, phone, overview } = req.body;

  // Validate input
  if (!name || !address || !email || !phone) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if a company with the same email already exists
    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      return res.status(400).json({ message: 'Company with this email already exists' });
    }

    // Create a new company profile
    const newCompany = new Company({
      name,
      address,
      email,
      phone,
      overview,
      logo: req.file ? req.file.path : null,
      user: req.user.id,
    });

    await newCompany.save();

    res.status(201).json({ message: 'Company profile created successfully', company: newCompany });
  } catch (error) {
    console.error('Error creating company profile:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a company profile
router.put('/company/:id', protect, upload.single('logo'), async (req, res) => {
  const { id } = req.params;
  const { name, address, email, phone, overview } = req.body;

  try {
    // Find the company by ID and update its details
    const updatedCompany = await Company.findByIdAndUpdate(
      id,
      {
        name,
        address,
        email,
        phone,
        overview,
        logo: req.file ? req.file.path : undefined,
      },
      { new: true, runValidators: true }
    );

    if (!updatedCompany) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.status(200).json({ message: 'Company profile updated successfully', company: updatedCompany });
  } catch (error) {
    console.error('Error updating company profile:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a company profile
router.delete('/company/:id', protect, async (req, res) => {
  const { id } = req.params;

  try {
    // Find the company by ID and delete it
    const deletedCompany = await Company.findByIdAndDelete(id);

    if (!deletedCompany) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.status(200).json({ message: 'Company profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting company profile:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all company profiles
router.get('/companies', async (req, res) => {
  try {
    // Fetch all companies from the database
    const companies = await Company.find();

    res.status(200).json({ message: 'Companies retrieved successfully', companies });
  } catch (error) {
    console.error('Error fetching company profiles:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get companies associated with the logged-in user
router.get('/my-companies', protect, async (req, res) => {
  try {
    // Find companies associated with the logged-in user
    const companies = await Company.find({ user: req.user.id });

    res.status(200).json({ message: 'Companies retrieved successfully', companies });
  } catch (error) {
    console.error('Error fetching companies:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
