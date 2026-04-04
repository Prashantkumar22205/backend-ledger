
const express = require("express")
const cookieParser =require("cookie-parser")
const userAuthentication = require("./routes/auth.route")
const accountRouter =require("./routes/account.route")
const transactionRouter = require("./routes/transaction.route")
const app = express();

app.use(express.json())
app.use(cookieParser())


app.use("/api/auth",userAuthentication)
app.use("/api/accounts",accountRouter)
app.use("/api/transaction",transactionRouter)



module.exports=app;