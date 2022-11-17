var express=require('express');
var router=express.Router();
var statisticalController =require("../app/controllers/statisticalController")


router.get('/',statisticalController.getStatiscalAdmin)
router.get('/month',statisticalController.getStatiscalMonth)
router.get('/categoryProduct',statisticalController.getCategoryByProduct)
router.get('/categoryOrder',statisticalController.getCategoryByOrder)
router.get('/productOrder',statisticalController.getProductOrder)

// router.put('/',cartController.updateCartItem)

module.exports=router