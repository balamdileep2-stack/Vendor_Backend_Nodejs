const VendorController = require('../Vendor_Controllers/VendorController');
const express = require('express');

const router = express.Router();

router.post('/register',VendorController.VendorRegister);
router.post('/login',VendorController.VendorLogin);

router.get('/all-vendors',VendorController.getAllVendors);
router.get('/single-vendor/:id',VendorController.getVendorById);
module.exports = router;