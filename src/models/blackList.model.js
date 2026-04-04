const mongoose = require("mongoose")

const tokenblackListSchema = new mongoose.Schema({
    token:{
        type:String,
        required:[true,"token is required to be blacklisted"],
        unique:[true,"token is already blacklisted"]
    }
},{timestamps:true})

tokenblackListSchema.index({createAt:1},{
    expireAfterSeconds:60*60*24*3
})

const tokenblackListModel = mongoose.model("tokenblackList",tokenblackListSchema)

module.exports=tokenblackListModel