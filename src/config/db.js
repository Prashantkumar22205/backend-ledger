const mongoose= require("mongoose")


const ConnetDB = async (req,res)=>{
      await mongoose.connect(process.env.MongoDB_Key)
       .then(()=>{
        console.log("DB is connected")
       })
       .catch(err=>{
          console.log(err)

       })

       
}

module.exports=ConnetDB