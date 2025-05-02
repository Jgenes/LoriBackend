const express = require('express');
const { protect } = require('../middleware/authMiddleware'); // Middleware to protect routes
const Product = require('../models/Product'); // Product model

const router = express.Router();

// Add a new product
router.post('/products', protect, async (req, res) => {
  const { name, description, price, category, stock, status } = req.body;

  try {
    // Create a new product
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      stock,
      status,
    });

    await newProduct.save();

    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (error) {
    console.error('Error adding product:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a product
router.put('/products/:id', protect, async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, stock, status } = req.body;

  try {
    // Find the product by ID and update
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, description, price, category, stock, status },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a product
router.delete('/products/:id', protect, async (req, res) => {
  const { id } = req.params;

  try {
    // Find the product by ID and delete
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// View a specific product
router.get('/products/:id', protect, async (req, res) => {
  const { id } = req.params;

  try {
    // Find the product by ID
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product retrieved successfully', product });
  } catch (error) {
    console.error('Error retrieving product:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// View all products
router.get('/products', protect, async (req, res) => {
  try {
    // Fetch all products
    const products = await Product.find();

    res.status(200).json({ message: 'Products retrieved successfully', products });
  } catch (error) {
    console.error('Error retrieving products:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;