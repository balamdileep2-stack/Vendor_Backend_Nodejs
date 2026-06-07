const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotEnv = require('dotenv');

const Vendor = require('../Schema_Model/Vendor_schema.js');

dotEnv.config();

const SecretKey=process.env.SECRET_KEY;

const VendorRegister = async(req,res)=>{
    const {username,email,password} = req.body;
    try{
      const VendorEmail =await Vendor.findOne({email});
      if(VendorEmail){
        return res.status(400).json("Email is already taken");
      }
      const hashedPassword = await bcrypt.hash(password,10);
      const newVendor = new Vendor({
        username,
        email,
        password:hashedPassword
      });
      await newVendor.save();

      res.status(201).json({message:"Vendor is registered Successfully"});
      console.log("registered");
    }catch(err){
      console.log(err);
      res.status(500).json({error:"Internal server error"});
    }
}

const VendorLogin = async(req,res)=>{
  const {email,password} = req.body;
  try{
    const vendor = await Vendor.findOne({email});
    if(!vendor || !(await bcrypt.compare(password,vendor.password))){
      return res.status(401).json({error:"Invalid Username or password!"})
    }
    const token = jwt.sign({vendorId:vendor._id},SecretKey,{expiresIn:"1h"})
    res.status(200).json({
    success: "Login is Successfull",
    token,
    vendorId: vendor._id
});
    console.log(email,"This is token",token);
  }catch(err){
    res.status(500).json({error:"There is an error at Vendor Login"});
  }
}

const getAllVendors = async(req,res)=>{
  try {
    const vendors = await Vendor.find().populate('firm');
    res.json({vendors})
  } catch (error) {
    console.log(error);
    res.status(500).json({error:"Internal sever error"});
  }
}

const getVendorById = async(req,res)=>{
  const vendorId = req.params.id;

  try{
    const vendor = await Vendor.findById(vendorId).populate('firm');
    if(!vendor){
      return res.status(404).json({error:"Vendor not found"})
    }
    res.status(200).json({vendor});
  }catch(error){
    console.log(error);
    res.status(500).json({error:"Internal sever error"});
  }
}

module.exports = {VendorRegister,VendorLogin,getAllVendors,getVendorById}