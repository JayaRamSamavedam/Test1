const express = require("express")

const router = express.Router();
const Controller = require("../controllers/userController"); 


router.post("/register",Controller.userRegister);
router.post("/login",Controller.userLogin);

module.exports=router;