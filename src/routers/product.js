var express =require('express')

var router= express.Router();
const productController =require('../app/controllers/productController');

router.get("/",productController.getAllProducts);

router.post("/add",productController.addProduct);
router.get("/trash",productController.trashProducts);
router.post("/search",productController.searchProducts);
router.get("/filter",productController.getFilter);
router.get('/:productId',productController.getProductId)
router.patch('/restore/:id',productController.restoreProduct);
router.delete('/force/:id',productController.deleteForceProduct);
router.delete('/:id',productController.deleteProduct);
router.put("/edit/:id", productController.updateProduct);

module.exports = router;