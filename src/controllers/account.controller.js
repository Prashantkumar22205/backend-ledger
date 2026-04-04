
const accountModel = require("../models/account.model")


const createAccount = async(req,res)=>{
        const user = req.user;

        const account = await accountModel.create({
            user:user._id
        })

        res.status(201).json({
            account
        })
}

const getAllAccount = async(req,res)=>{
    const account = await accountModel.find({user:req.user._id})
    return res.status(200).json({
        account
    })
}

const getAccountBalanceController = async(req,res)=>{
    const {accountId} = req.params;

    const account = await accountModel.findOne({
        _id:accountId,
        user:req.user._id
    })

    if(!account){
        return res.status(400).json({
            message:"Account not Found"
        })
    }

    const balance = await account.getBalance()

   res.status(200).json({
        accountId:account._id,
        balance:balance
    })
}

module.exports={createAccount,getAllAccount,getAccountBalanceController}