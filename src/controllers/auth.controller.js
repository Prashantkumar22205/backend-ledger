
const userModel= require("../models/auth.model")
const jwt = require("jsonwebtoken")
const emailService = require("../services/email.service")
const tokenblackList =require("../models/blackList.model")
/**
 * - user registeration  controller
 * - POST /api/auth/register
 */
const userRegisteration = async(req,res)=>{
      const {email,name,password}= req.body;
      const isemail = await userModel.findOne({
        email:email
      })

      if(isemail){
        return res.status(422).json({
            message:"User already exist with email",
            status:"failed"
        })
      }

      const user = await userModel.create({
        email,password,name
      })

      const token=jwt.sign({userId : user._id},process.env.JWT_SecretKey,{expiresIn:"3d"})

       res.cookie("token",token)

       res.status(201).json({
          user:{
              _id:user._id,
              name:user.name,
              email:user.email,
              
          },
          token
       })

       await emailService.sendRegistrationEmail(user.email,user.name)
}

/**
 * - user login  controller
 * - POST /api/auth/login
 */

const userLogin = async(req,res)=>{
     
      const {email,password} = req.body

      const user = await userModel.findOne({email}).select("+password")

      if(!user){
        return res.status(401).json({
            message:"Email or Password is invalid"
        })
      }

      const isValidPassword = user.comparePassword(password)

      if(!isValidPassword){
         return res.status(401).json({
            message:"Email or Password is invalid"
        })
      }

      const token = jwt.sign({userId:user._id},process.env.JWT_SecretKey,{expiresIn:"3d"})
      res.cookie("token",token)

      res.status(201).json({
        message:"Login successful",
          user:{
              _id:user._id,
              name:user.name,
              email:user.email
          },
          token
       })

       
}

const userLogout = async(req,res)=>{
    const token = req.cookies.token || req.header.authorization?.split(" ")[1]

    if(!token){
      return res.status(200).json({
        message:"User is Logout Successfully"
      })
    }

    await tokenblackList.create({
      token:token
    })

    res.clearCookie("token")

    res.status(200).json({
      message:"user logout is successfull"
    })
}


module.exports={userRegisteration,userLogin,userLogout}