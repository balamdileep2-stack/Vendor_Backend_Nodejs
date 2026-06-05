const express = require('express');
const ProductController = require('../Vendor_Controllers/ProductController');

const router = express.Router();

router.post('/add-product/:firmId',ProductController.addProduct);
router.get('/:firmId/products',ProductController.getProductByFirm);
router.delete('/:productId',ProductController.deleteProductById);


router.get('/uploads/:imageName',(req,res)=>{
  const imageName=req.params.imageName;
  res.headersSent('Content-type','image/jpeg');
  res.sendFile(path.join(__dirname,'..','uploads',imageName));
})

module.exports = router;