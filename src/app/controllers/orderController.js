const Order=require('../models/Order')
const OrderItem=require('../models/OrderItem')
const User=require('../models/User')
const Product=require('../models/Product')
const Cart=require('../models/Cart')
const Bluebird=require('bluebird')
const PAGE_SIZE = 4;


const orderController = {

    createOrder :async (req,res,next)=>{
        try{
    
            const {infoOrder,cartItem} ={...req.body}
            const newOrder= await Order.create(infoOrder);
            console.log("cartItem: ",cartItem)
            
          const newOrderItem = await Bluebird.map(cartItem,async(item)=>{
                const price = await Product.findById(item.product).select('price').lean()                
                return{...item,price: price.price,order:newOrder._id};
          },{concurrency:cartItem.length})
          console.log(newOrderItem)
            

            const createOrderItem=await OrderItem.create(newOrderItem)
            // Bluebird.map(cartItem,async(item)=>{
            //     await Product.updateOne(
            //         {_id:item.product},
            //        { $inc : {sold: -item.quantity}}
            //         )
            // },{concurrency:cartItem.length})
            const cartId=cartItem.map(item=>({
                _id:item.cartId
            }))
            await Cart.deleteMany({ _id : { $in: cartId }})
            res.status(200).json({success:true,newOrder,createOrderItem,status:"ok"})
        }catch(error){
            next(error)
        }
    
    },

    getAllOrder: async (req, res) => {
        var page = req.query.page;
        try {
          if (page) {
            page = parseInt(page);
            if (page < 0) page = 0;
            var skip = (page - 1) * PAGE_SIZE;
    
            const orders = await Order.find();
    
            res.status(200).json(orders);
          } else {
            const orders = await Order.find();
    
            const orders1 =await Bluebird.map(orders,
              async(item)=>{
                  const orderItems= await OrderItem.find({order : {$in : item._id }})
                                                  .populate('product')
                                                  .lean()
                  const user1=await User.findById(item.user).lean()
                  const totalPrice =orderItems.reduce((total,item)=>{
                          return  total + item.quantity * item.price
                  },0)
                  const order2 = {
                    id: item._id,
                    username: user1.username,
                    email: user1.email,
                    totalPrice: totalPrice,
                    items: orderItems,
                    deliveryAddress:item.deliveryAddress,
                    fullName: item.fullName,
                    phoneNumber: item.phoneNumber,
                    cancel: item.cancel,
                    status: item.status,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,
                  }
              // return {totalPrice,items:orderItems,user:user1,order:item}
              return order2;
          },{concurrency : orders.length})
          return res.status(200).json(orders1)
          }
        } catch (err) {
          res.status(401).json(err);
        }
      },
      getUserOrder: async (req, res,next) => {
        try{
            // console.log(req.params.userId);
            const orders=await Order.find({user:req.params.userId}).populate('user').lean()
             console.log(orders)
            const orders1 =await Bluebird.map(orders,
                async(item)=>{
                    const orderItems= await OrderItem.find({order : {$in : item._id }})
                                                    .populate('product')
                                                    .lean()
                    const totalPrice =orderItems.reduce((total,item)=>{
                            return  total + item.quantity * item.price
                    },0)
                return {...item,totalPrice,items:orderItems}
            },{concurrency : orders.length})
            return res.status(200).json({success:true,orders1,status:"ok"})
            
        }catch(error){
            next(error)
        }
      },
      getOrderId:async(req,res,next)=>{
        try{
          // console.log(req.params.userId); 
          
          const orders=await Order.findById(req.params.orderId);
          // console.log(orders)
          
          const orderItems= await OrderItem.find({order : {$in : orders._id }})
                                                  .populate('product')
                                                  .lean()
          console.log(orderItems)
          const totalPrice =await orderItems.reduce((total,item)=>{
                          return  total + item.quantity * item.price
                  },0)
           const user1=await User.findById(orders.user).lean()
          const orders1= orderItems.map((item)=>({
            id: orders._id,                
            nameProduct:item.product.name,
            price:item.price,
            quantity:item.quantity,
            images:item.product.images,
           
          }))
          
          return res.status(200).json({orders1,totalPrice,username:user1.username, status:orders.status,id:orders.id, cancel:orders.cancel})
          
      }catch(error){
          next(error)
      }
    },
    confirmOrder: async(req,res,next)=>{
      try{
        // console.log(req.params.userId); 
        
        const orders=await Order.updateOne({_id:req.params.id},{status: true} );
        const orderItem =await OrderItem.find({order:req.params.id})
        Bluebird.map(orderItem,async(item)=>{
          await Product.updateOne(
              {_id:item.product},
             { $inc : {sold: -item.quantity}}
              )
      },{concurrency:orderItem.length})
        console.log(orders)
        
        
        return res.status(200).json(orders)
        
    }catch(error){
        next(error)
    }
    },
    cancelOrder: async(req,res,next)=>{
      try{
        // console.log(req.params.userId); 
        
        const orders=await Order.updateOne({_id:req.params.id},{cancel: true} );
        console.log(orders)
        
        
        return res.status(200).json(orders)
        
    }catch(error){
        next(error)
    }
    }
      
}

module.exports = orderController;