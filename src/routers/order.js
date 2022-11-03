var express=require('express');
var router=express.Router();
const orderController = require('../app/controllers/orderController');
router.get('/:orderId',orderController.getOrderId)
router.post('/add',orderController.createOrder)
router.get('/:userId',orderController.getUserOrder)
router.post('/confirm/:id',orderController.confirmOrder)
router.post('/cancel/:id',orderController.cancelOrder)
router.get('/',orderController.getAllOrder)



// router.delete('/:cardId',cartController.deleteCartItem)
// router.put('/',cartController.updateCartItem)

module.exports=router