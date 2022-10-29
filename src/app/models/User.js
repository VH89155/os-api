const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 4,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      minlength: 6,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      
    },
    admin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
userSchema.pre('save', async function(next){
  try{
    const salt = await bcrypt.genSalt(10)

    const passwordHashed = await bcrypt.hash(this.password, salt)

    this.password = passwordHashed 

  }
  catch(err){
    next(err)
  }
})

userSchema.methods.isValiPassword = async function(newPassword){
  try{
   return await bcrypt.compare(newPassword, this.password);

  }
  catch(err){
    throw new Error(error)
  }
}
 module.exports = mongoose.model("User",userSchema);