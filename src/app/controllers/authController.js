const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserDetail =require("../models/UserDetail")
let ArrayrefershToken= [{}];
const authController ={
    //Register

    registerUser: async(req,res) =>{
        try{         
            const newUser = await new User({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
            });
           
            // Save to DB
            const user = await newUser.save();
           
            res.status(200).json({ user, status: true});
        }
        catch(err){
            res.status(500).json(err);
            
        }
    },
    // GENNERATE ACCESS TOKEN
        gennerateAccesToken: (user) =>{
            return jwt.sign({
                id: user.id,
                admin: user.admin
            },
            "secretkey",
            {
                // thoi' gian token het; han
                expiresIn: "1h"
            }
           
            );
        },
        // GENNERATE REFERSH TOKEN
        gennerateRefershToken: (user) =>{
            return jwt.sign({
                id: user.id,
                admin: user.admin
            },
            "refreshkey",
            {
                // thoi' gian token het; han
                expiresIn: "365d"
            }
           )
        },

     //Login
     loginUser: async(req,res)=>{
        try{
            const user = await User.findOne({username: req.body.username});
            console.log(user)
            if(!user){
                res.status(404).json("Waring username");
            }
            
             
            const validPassword = await user.isValiPassword(req.body.password);
            console.log(validPassword)
            if(!validPassword){
                res.status(404).json("Waring password");
            }
            if(user && validPassword){
                const accessToken = authController.gennerateAccesToken(user);               
                const refreshToken = authController.gennerateRefershToken(user);
                ArrayrefershToken.push(refreshToken);
                res.cookie("refreshToken", refreshToken,{
                    httpOnly: true,
                    secure: false,
                    path:"/",
                    sameSite: "strict"
                });
               
                const {password, ... orthes} = user._doc;
                // const {_id} ={...orthes}
                // console.log(_id)
                // const userN =await User.findOne({username:user.username})
                // console.log(userN)
                const profile= await UserDetail.findOne({username: {$in :user.username}})
                console.log(profile)
                res.status(200).json({...orthes,password:req.body.password,profile,accessToken,refreshToken});
                
            }

        }
        catch(err){
            res.status(500).json(err);
        }
     },
     resetPassword :async (req,res)=>{
            try{
                const { userID,username, currentPass, newPass } = { ...req.body };
                const user = await User.findOne({username: username});
                console.log(user)
            if(!user){
                res.status(404).json({status:"Waring username",success:false});
            }
          
            const validPassword =  await user.isValiPassword(currentPass) 
            if(!validPassword){
                res.status(404).json({status:"Waring password",success:false});
            }
            if(user && validPassword){
                const salt = await bcrypt.genSalt(10);
                 // generate a password hash (salt + hash)
                const passwordHashed = await bcrypt.hash(newPass, salt);
                await User.findByIdAndUpdate(userID, {
                    $set: { password: passwordHashed },
                  });
                res.status(200).json({ success: true });
            }

            }
            catch(err){
                res.status(500).json(err);  
            }
     },

     requestRefreshToken: async(req,res) =>{
        // Take refersh token from user
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken)  return res.status(401).json("You're not authenticated");
        if(!ArrayrefershToken.includes(refreshToken)){
            return res.status(403).json("Refersh tojen is not valid");
        }
        jwt.verify(refreshToken,"refreshkey",(err,user) =>{
            if(err){
                console.log(err);
            }
            ArrayrefershToken = ArrayrefershToken.filter((token)=> token !== refreshToken);
            const newAccessToken = authController.gennerateAccesToken(user);
            const newRefreshToken = authController.gennerateRefershToken(user);
            ArrayrefershToken.push(newRefreshToken);
          
            res.cookie("refreshToken", newRefreshToken,{
                httpOnly: true,
                secure: false,
                path:"/",
                sameSite: "strict"
            });
            res.status(200).json({
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            });
        })
     },
     userLogout: async(req, res) =>{
        
        refreshToken = ArrayrefershToken.filter(token => token !== req.body.token);
        res.clearCookie("refreshToken");
        res.status(200).json("Logged out!");
     },
     secret: async(req,res,next) =>{
        res.status(200).json("singSecret")
    },

    /// Post User Details
     

   
}

//


module.exports = authController;