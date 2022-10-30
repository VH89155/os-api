var express=require('express');
var router=express.Router();
var cartController =require('../app/controllers/cartController')

router.post('/add',cartController.addTocart)
router.get('/:userId',cartController.getCartItem)
// router.delete('/',cartController.deleteCartItem)
// router.put('/',cartController.updateCartItem)

module.exports=router