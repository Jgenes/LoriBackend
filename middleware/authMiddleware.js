const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Company = require('../models/Company');

const protect = async (req, res, next) => {
  let token;

  // Check if the token is provided in the Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token
      token = req.headers.authorization.split(' ')[1];

      // Verify the token
      const decoded = jwt.verify(token, 'your_jwt_secret'); // Replace 'your_jwt_secret' with your actual secret

      // Attach the user to the request object
      req.user = await User.findById(decoded.id).select('-password');

      // Optionally, check if the user has an associated company
      const company = await Company.findOne({ user: req.user.id });
      if (company) {
        req.user.company = company._id; // Attach the company ID to the request object
      }

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error('Authentication error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    // If no token is provided
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };