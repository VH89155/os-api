const User = require('..//app/models/User')
const Token =require('..//app/models/Token')
const sendEmail = require ('..//app/utils/sendEmails')
const crypto =require("crypto");
const express =require('express');
const router =express.Router();
const bcrypt = require("bcrypt");

router.post("/password-new", async (req, res) => {
    try {
        
        
        const user = await User.findOne({ username:req.body.username});
        if (!user) return res.status(400).send("invalid link or expired");

        const token = await Token.findOne({
            userId: user._id,
            token: req.body.token,
        });
        console.log(token);
        if (!token) return res.status(400).send("Invalid link or expired");
        const salt = await bcrypt.genSalt(10);
        const passwordHashed = await bcrypt.hash(req.body.password, salt);

        // user.password =  passwordHashed;
        await User.findByIdAndUpdate(user._id, {
            $set: { password: passwordHashed },
          });
        await token.delete();

       res.status(200).json({user, success: true});
    } catch (error) {
        res.status(401).json(err)
        console.log(error);
    }
});
router.post("/", async (req, res) => {
    try {
        

        const user = await User.findOne({ email: req.body.email });
        if (!user)
            return res.status(400).send("user with given email doesn't exist");

        let token = await Token.findOne({ userId: user._id });
        if (!token) {
            token = await new Token({
                userId: user._id,
                token: crypto.randomBytes(6).toString("hex"),
            }).save();
        }

        const link = token.token
       
        await sendEmail(user.email, "Password reset", link);

        res.status(200).json({status:"password reset link sent to your email account",token,success:true});
    } catch (error) {
        res.status(401).json(err)
        console.log(error);
    }
});


module.exports = router;