const multer = require('multer');
const Firm = require('../Schema_Model/Firm_schema');
const Product = require('../Schema_Model/Product_schema');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

const addProduct = async(req,res) =>{
  try {
    const {productName,price,category,bestseller,description} = req.body;

    const image = req.file ? req.file.filename : '';

    const firmId = req.params.firmId;
    const firm = await Firm.findById(firmId);

    if(!firm){
      return  res.status(400).json({error:"No firm Found"});
    }

    const products = new Product({
      productName,
      price,
      category,
      bestseller,
      description,
      image,
      firm:[firm._id]
    });

    const savedProduct = await products.save();

    firm.Product.push(savedProduct);

    await firm.save()

    res.status(200).json(savedProduct)
  
  } catch (error) {
  console.error(error)
  res.status(500).json({error:"Internal server error"}) 
  }

}


const getProductByFirm = async(req,res) =>{
  try {
    const firmId = req.params.firmId;
    const firm = await Firm.findById(firmId);

    if(!firm){
      return res.status(400).json({error:"No firm founded"});
    }

    const restaurantName = firm.firmName;
    const products = await Product.find({firm:firmId});

    res.status(200).json({restaurantName,products});
  } catch (error) {
    console.error(error);
    res.status(500).json({error:"Internal server error"});
  }
}

const deleteProductById = async(req,res)=>{
  try{
    const productId = req.params.productId;

    const deletedProduct = await Product.findByIdAndDelete(productId);
    if(!deletedProduct){
      return res.status(400).json({error:"No product found"})
    }
    res.status(200).json({message:"product Deleted Successfully"})
  }catch(error){
    console.log(error);
    res.status(500).json({error:"Internal server error"})
  }
}

module.exports = {addProduct:[upload.single('image'),addProduct],getProductByFirm,deleteProductById} 