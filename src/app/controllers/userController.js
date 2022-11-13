const User = require("../models/User");
const PAGE_SIZE = 4;
const UserDetail = require("../models/UserDetail");
const userController = {
  getAllUsers: async (req, res) => {
    var page = req.query.page;
    try {
      if (page) {
        page = parseInt(page);
        if (page < 0) page = 0;
        var skip = (page - 1) * PAGE_SIZE;

        const users = await User.find();

        res.status(200).json(users);
      } else {
        const users = await User.find();

        res.status(200).json(users);
      }
    } catch (err) {
      res.status(401).json(err);
    }
  },
  getUserID: async (req, res) => {
    try {
      const user = await User.find(req.params.UserId).lean();
      if (!user) {
        return res.status(401).json("Loi roi");
      } else {
        // await User.updateOne(
        //   { _id: req.params.productId },
        //   { $inc: { view: 1 } }
        // ).exec();
        return res.status(200).json(user);
      }
    } catch (err) {
      return res.status(401).json(err);
    }
  },
  postProfileUser: async (req, res) => {
    try {
      const { user, deliveryAddress, fullName, phoneNumber,username } = {...req.body};
      console.log(user, deliveryAddress, fullName, phoneNumber)
      let profileUser = await UserDetail.findOne({user});
      console.log(profileUser)
      if (!profileUser) {
      await  UserDetail.create({ user, deliveryAddress, fullName, phoneNumber,username });
        return res.status(200).json({ success: true });
      } 
      else {
        profileUser.fullName = fullName;
        profileUser.username = username;
        profileUser.phoneNumber = phoneNumber;
        profileUser.deliveryAddress = deliveryAddress;
        await profileUser.save();
        return res
          .status(200)
          .json({ success: true, profileUser: profileUser });
      }
    } 
    catch (err) {
      return res.status(401).json({ success: false, err });
    }
  },
  getProfileUser: async (req,res)=>{
    try{
     
    }
    catch (err){
      return res.status(401).json({ success: false, err });
    }
  }
};

module.exports = userController;
