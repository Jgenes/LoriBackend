const express = require('express');
const connectDB = require('./db/Database'); // Ensure the path is correct
const userRoutes = require('./routes/userRoutes'); // Import the user 
const driverRoutes = require('./routes/driverRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const carLicenseRoutes = require('./routes/carLicenseRoutes');
const orderRoutes = require('./routes/orderRoutes');
const truckOrderRoutes = require('./routes/truckOrderRoutes');
const customerRoutes = require('./routes/customerRoutes');
const subOrderRoutes = require('./routes/subOrderRoutes');
const productRoutes = require('./routes/productRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const financeRoutes = require('./routes/financeRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const locationRoutes = require('./routes/locationRoutes');


const app = express();

connectDB(); // Connect to MongoDB

app.use(express.json());

// Use the user routes
app.use('/api/users', userRoutes);
//Use the driver routes
app.use('/api', driverRoutes);
app.use('/api', carLicenseRoutes);
app.use('/api', carLicenseRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/truck-orders', truckOrderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/sub-orders', subOrderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/location', locationRoutes);

app.get('/', (req, res) => {
  res.send('Server is running with MongoDB!');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
