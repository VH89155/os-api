var express =require('express')
var router= express.Router();

const userController =require('../app/controllers/userController');


router.post("/profile",userController.postProfileUser);
router.get("/",userController.getAllUsers);

// router.get("/",userController.getAllUsers);

module.exports = router;