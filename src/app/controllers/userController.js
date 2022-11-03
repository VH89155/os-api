const User=require('../models/User');
const PAGE_SIZE = 4;

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

};

module.exports = userController;
