const express = require('express');
const mongoose = require('mongoose');
const dotEnv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');

const VendorRoutes = require('./Vendor_Routes/VendorRoutes');
const FirmRoutes = require('./Vendor_Routes/FirmRoutes');
const ProductRoutes = require('./Vendor_Routes/ProductRoute');

const app = express();

dotEnv.config();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(bodyParser.json());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_DB)
  .then(() => {
    console.log('The Database is connected Successfully!');
  })
  .catch((err) => {
    console.log('Something is wrong while connecting to database', err);
  });

// Routes
app.use('/vendor', VendorRoutes);
app.use('/firm', FirmRoutes);
app.use('/product', ProductRoutes);

// Static Files
app.use('/uploads', express.static('uploads'));

// Home Route
app.get('/', (req, res) => {
  res.send('Welcome to MealJet');
});

// Server
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`The server is running successfully on port ${port}`);
});