const mongoose = require("mongoose")

const transactionSchema= new mongoose.Schema({
    fromAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,"Transaction must be associated with a from account"],
        index:true
    },
    toAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,"Transaction must be associated with a to account"],
        index:true
    },
    status:{
        type:String,
        enum:{
            values:["PENDING","FAILED","COMPLETED","REVERSED"],
            message:"status can either be PENDING , FAILED,COMPELETED or REVERSED"
        },
        default:"PENDING"
    },
    amount:{
        type:Number,
        required:[true,"ammount is required for making transaction"],
        min:[0,"amount cannot be negative"]
    },
    idempotencyKey:{
        type:String,
        required:[true,"idempotencyKey is required for making transaction"],
        index:true,
        unique:true
     }
},{
    timestamps:true
})

const transactionModel = mongoose.model("transaction", transactionSchema)

module.exports=transactionModel