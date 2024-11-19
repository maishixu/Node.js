const express = require("express")
const path = require("path")
const app = express()
app.listen((3000),(req,res)=>{
    console.log("服务器已启动")
})
//引入cookie
const cookieParser = require("cookie-parser")
//使生效
app.use(cookieParser())
//使路由生效
app.use("/students",require(path.resolve(__dirname,"./routes/student")))