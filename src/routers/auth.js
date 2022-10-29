var express = require('express');
var router = express.Router();
// const middlewareController = require('../app/controllers/middlewareController');
const authController = require('../app/controllers/authController');
// const {schemas,validateBody,validateParam} = require('../app/helpers/routerHelpers');



// Register
// router.post("/register",validateBody(schemas.authSignUpSchema) , authController.registerUser);
router.post("/register", authController.registerUser);

// Login
router.post("/login",authController.loginUser);
// router.post("/login", middlewareController.verifyToken,authController.loginUser);
//REFERSH TOKEN
router.post("/refresh", authController.requestRefreshToken);
// router.get("/secret", passport.authenticate('jwt',{session: false}),authController.secret);
// router.get("/secret", middlewareController.verifyToken,authController.secret);

// router.post("/logout",middlewareController.verifyToken, authController.userLogout);
module.exports = router;
