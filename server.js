  require("dotenv").config()
const express = require("express")
const app = require("./src/app")
const ConnetDB=require("./src/config/db")

ConnetDB()

app.listen(3000,()=>{
    console.log("Server is running ")
})