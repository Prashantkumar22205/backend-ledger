const express = require("express")
const userAuth = require("../controllers/auth.controller")
const router = express.Router()

router.post("/register",userAuth.userRegisteration)
router.post("/login",userAuth.userLogin)
router.post("/logout", userAuth.userLogout)
module.exports=router