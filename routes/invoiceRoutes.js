const express = require('express');
const { protect } = require('../middleware/authMiddleware'); // Middleware to protect routes
const Invoice = require('../models/Invoice'); // Invoice model
const Order = require('../models/Order'); // Order model
const PDFDocument = require('pdfkit'); // PDF generation library

const router = express.Router();

// Generate and download an invoice as a PDF
router.get('/invoices/:id/pdf', protect, async (req, res) => {
  const { id } = req.params;

  try {
    // Find the invoice by ID
    const invoice = await Invoice.findById(id).populate('order'); // Populate order details

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Create a new PDF document
    const doc = new PDFDocument();

    // Set the response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`);

    // Pipe the PDF document to the response
    doc.pipe(res);

    // Add content to the PDF
    doc.fontSize(20).text('Invoice', { align: 'center' });
    doc.moveDown();

    doc.fontSize(14).text(`Invoice Number: ${invoice.invoiceNumber}`);
    doc.text(`Issue Date: ${invoice.issueDate.toDateString()}`);
    doc.text(`Due Date: ${invoice.dueDate.toDateString()}`);
    doc.text(`Status: ${invoice.status}`);
    doc.moveDown();

    doc.fontSize(16).text('Order Details:');
    doc.fontSize(14).text(`Order ID: ${invoice.order._id}`);
    doc.text(`Total Quantity: ${invoice.order.totalQuantity}`);
    doc.text(`Total Amount: $${invoice.totalAmount}`);
    doc.moveDown();

    doc.fontSize(16).text('Thank you for your business!', { align: 'center' });

    // Finalize the PDF and end the stream
    doc.end();
  } catch (error) {
    console.error('Error generating PDF:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;