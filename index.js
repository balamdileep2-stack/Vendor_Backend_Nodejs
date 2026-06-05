const express = require('express');
const mongoose=require('mongoose');
const dotEnv = require('dotenv');
const bodyParser = require('body-parser');
const path = require('path');

const VendorRoutes= require('./Vendor_Routes/VendorRoutes');
const FirmRoutes = require('./Vendor_Routes/FirmRoutes');
const ProductRoutes = require('./Vendor_Routes/ProductRoute');


const app = express();
dotEnv.config();

mongoose.connect(process.env.MONGO_DB)
.then(()=>{
  console.log("The Database is connected Successfully!");
})
.catch((err)=>{
  console.log("Something is wroung while connecting to database",err);
})

app.use(bodyParser.json());
app.use('/vendor',VendorRoutes);
app.use('/firm',FirmRoutes);
app.use('/product',ProductRoutes);
app.use('/uploads',express.static('uploads'))


const port = process.env.PORT||4000;

app.listen(port,(req,res)=>{
  console.log(`The server is running successfully ${port}`);
})

app.use('/',(req,res)=>{
  res.send('Welcome to MealJet');
})