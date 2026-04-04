const userModel = require("../models/auth.model")
const jwt= require("jsonwebtoken")
const tokenblackListModel = require("../models/blackList.model")

const authMiddleware = async(req,res,next)=>{
    const token= req.cookies.token || req.headers.authorization?.split(" ")[1]
    if(!token){
       return res.status(401).json({
            message:"unauthorized access token is missing"
        })
    }

     const isBlackList =await tokenblackListModel.findOne({token})

     if(isBlackList){
        return res.status(401).json({
            message:"invalid token"
        })
     }
    try{
        const decode= jwt.verify(token,process.env.JWT_SecretKey)
        const user= await userModel.findById(decode.userId)

        req.user = user
      return next()
    }catch(err){
        return res.status(401).json({
            message:"Unauthorized access ,token is  invalid"
        })
    }

}

const authSystemUserMiddleware = async(req,res,next)=>{
     const token = req.cookies.token|| req.headers.authorization?.split(" ")[1]

     if(!token){
       return  res.status(401).json({
            message:"unauthorized access token is missing"
        })
     }

     
     const isBlackList =await tokenblackListModel.findOne({token})

     if(isBlackList){
        return res.status(401).json({
            message:"invalid token"
        })
     }

     try{

        const decode = jwt.verify(token,process.env.JWT_SecretKey)

        const user = await userModel.findById(decode.userId).select("+systemUser")

        if(!user.systemUser){
            return res.status(403).jsom({
                message:"Forbidden access ,not a system user"
            })
        }

        req.user = user
       return next()
       
     }catch(err){
        return res.status(400).json({
            message:"Unauthorized access ,token is invalid"
        })
     }

}

module.exports={authMiddleware,authSystemUserMiddleware}