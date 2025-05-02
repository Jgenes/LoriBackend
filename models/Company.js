const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
  },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Associate with a user
  overview: { type: String }, // Add company overview
  logo: { type: String }, // Add company logo (file path or URL)
}, { timestamps: true }); // Add timestamps for createdAt and updatedAt

module.exports = mongoose.models.Company || mongoose.model('Company', companySchema);

