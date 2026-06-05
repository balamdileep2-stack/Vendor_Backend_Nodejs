const Vendor = require('../Schema_Model/Vendor_schema');
const jwt = require('jsonwebtoken');
const dotEnv = require('dotenv');

dotEnv.config();

const SecretKey = process.env.SECRET_KEY;

const verifyToken = async (req, res, next) => {
  const token = req.headers.token;

  if (!token) {
    return res.status(401).json({ error: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, SecretKey);

    const vendor = await Vendor.findById(decoded.vendorId);

    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    req.vendorId = vendor._id;

    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = verifyToken;