
var mongoose=require('mongoose')
var Schema=mongoose.Schema

var userDetailSchema=new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    username:{
        type:String,
        required:true
    },
    deliveryAddress:{
        type:String,
        required:true
    },
    fullName:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:String,
        required:true
    },
    
},{timestamps:true});

userDetailSchema.index({user:1})
module.exports=mongoose.model('UserDetail',userDetailSchema);
