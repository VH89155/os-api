var express =require('express')

var router= express.Router();
const productController =require('../app/controllers/productController');

router.get("/trash",productController.trashProducts);
router.get('/:productId',productController.getProductId)

router.post("/add",productController.addProduct);

router.post("/search",productController.searchProducts);
router.post("/category",productController.getCategory);
router.get("/filter",productController.getFilter);

router.patch('/restore/:id',productController.restoreProduct);
router.delete('/force/:id',productController.deleteForceProduct);
router.delete('/:id',productController.deleteProduct);
router.put("/edit/:id", productController.updateProduct);
router.get("/",productController.getAllProducts);
module.exports = router;