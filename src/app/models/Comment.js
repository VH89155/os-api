
var mongoose=require('mongoose');
var Schema=mongoose.Schema

const commentSchema=new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    author:{
        type:String,
        required:true
    },
    comment:{
        type:String,
        required:true
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true
    },
    
},{timestamps:true})

module.exports=mongoose.model('Comment',commentSchema);
