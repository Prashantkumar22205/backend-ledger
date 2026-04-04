const { select } = require("framer-motion/client")
const mongoose=require("mongoose")
const bcrypt=require("bcryptjs")

const userSchema = new mongoose.Schema({
    email:{
          type:String,
          required:[true,"email is required"],
          trim:true,
          match:[ /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"Invalid Email adress"],
          unique:[true,"Email is already exist"]

    },
    name:{
        type:String,
        required:[true,"Name is required"],

    },
    password:{
        type:String,
        required:[true,"Password is required"],
        minlength:[6,"Passwoord should be more than 6 character"],
        select:false
    },
    systemUser:{
        type:Boolean,
        default:false, 
        immutable:true,
        select:false
    }

},{
    timestamps:true
})

userSchema.pre("save",async function(password){
    if(! this.isModified("password")){
        return 
    }

    const  hash =await bcrypt.hash(this.password,10)
    this.password=hash

    return 
})

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password)
}

userModel = mongoose.model("user",userSchema)

module.exports=userModel