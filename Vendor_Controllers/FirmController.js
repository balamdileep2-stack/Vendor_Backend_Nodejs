const Firm = require('../Schema_Model/Firm_schema');
const Vendor = require('../Schema_Model/Vendor_schema');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

const addFirm = async (req, res) => {
  try {
    const { firmName, area, category, region, offer } = req.body;

    const image = req.file ? req.file.filename : '';

    const vendor = await Vendor.findById(req.vendorId);

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    const firm = new Firm({
      firmName,
      area,
      category,
      region,
      offer,
      image,
      vendor: [vendor._id]
    });

    const savedFirm = await firm.save();

    const firmId = savedFirm._id

    vendor.firm.push(savedFirm._id);

    await vendor.save();

    return res.status(201).json({message: 'Firm added successfully by you',firmId});

  } catch (err) {
    console.log(err);

    return res.status(500).json({
      error: err.message
    });
  }
};

const deleteFirmById = async(req,res)=>{
  try{
    const firmId = req.params.firmId;

    const deletedFirm = await Firm.findByIdAndDelete(firmId);
    if(!deletedFirm){
      return res.status(400).json({error:"No Firm found"})
    }
    res.status(200).json({message:"Firm Deleted Successfully"});
  }catch(error){
    console.log(error);
    res.status(500).json({error:"Internal server error"})
  }
}

module.exports = {addFirm: [upload.single('image'), addFirm],deleteFirmById};