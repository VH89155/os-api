// const { find } = require('../models/Cart');
const Cart=require('../models/Cart');
const Product=require('../models/Product');

const checkTocart = async({user,product,quantity,add}) =>{
    const exitsCartItem = await Cart.findOne({user,product})
    if(!exitsCartItem){
        return Cart.create({user,product,quantity})
    }
    else{
        let newQuantity= 0;
       
        if(add ===1){
            newQuantity =Number(quantity) +  exitsCartItem.quantity
        }
        else {
            newQuantity =Number(quantity)
        }
           
        const fullProduct=await Product.findById(product)
        if(newQuantity>fullProduct.sold){
                
                return "Loi, roi";
                // return next(err)
        }
        exitsCartItem.quantity=newQuantity;
        return exitsCartItem.save();
    }
   
}

const cardController ={


    
    addTocart : async (req,res,next)=> {
        try{

            const {user,product,quantity,add}={...req.body}
            const result= await checkTocart({user,product,quantity,add})

            return res.status(200).json({success:true,result,status:"ok"})
        }
        catch(error){
            next(error)
        }
   },

   getUserCartItem : async(req,res,next)=>{
        try{
            // console.log(req.params.userId);
            const carts=await Cart.find({user:req.params.userId}).populate('user').populate('product').lean()
            //loc trung
            const uniqueProductIds = carts.filter((item,index,cartArray) => {
              return  cartArray.findIndex((vItem) => {
                    return  vItem.product._id.toString() === item.product._id.toString()
                    })===index
            })
            .map((item) => item.product._id)
            // console.log("unique",uniqueProductIds)
            // const allSizes = await Size.find({ product: { $in: uniqueProductIds } })
            // .select('product name numberInStock')
            // .lean()
            // // console.log("full size",allSizes)
            // carts.forEach(item=>{
            //     item.product.sizes= allSizes.filter(size=>size.product.toString()===item.product._id.toString())
            // })
            return res.status(200).json({success:true,carts,status:"ok"})
            
        }catch(error){
            next(error)
        }
   },

//    const checkUpToCart=async ({user,product,_id,size,quantity})=>{
//        const CartItem=await Cart.find({user})
//        const exitCartItem = CartItem.find(item=>{
//            return item._id.toString()!=_id.toString() && item.product.toString()===product.toString() && item.size===size 
//         })
//         console.log("exitCartItem",exitCartItem)
//             if(exitCartItem){
//                 exitCartItem.quantity+=quantity
//                 await Cart.deleteOne({_id})
//             return exitCartItem.save()
//             }
//             const fullSize = await Size.findOne({product,name:size})
//             if (fullSize.numberInStock < quantity){
//                 var err=new Error('kh??ng ????? s??? l?????ng trong kho');
//                 err.status(404)
//                 return next(err)
//             }
//             const result = await Cart.findByIdAndUpdate(_id,{size,quantity},{new:true}).lean()
//             return result
//    }
//    const updateCartItem= async (req,res,next)=>{
//         try{
//                 const {user,product,_id,size,quantity}={...req.body}
//                 console.log(req.body)
             
//                 const result= await checkUpToCart({user,product,_id,size,quantity})
//                 return res.status(200).json({success :true,result,status:"ok"})
//         }
//         catch(error){
//             next(error)
//         }
//    }

    deleteCartItem: async (req,res,next)=>{
        try{
           
            await  Cart.deleteOne({ _id: req.params.cartId})
            return res.status(200).json({success:true,status:"ok"})
        }catch(error){
            next(error)
        }
   }

}
module.exports=cardController;