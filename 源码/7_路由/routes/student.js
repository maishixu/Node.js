/* user.js文件 */
const express = require("express")
//创建router对象
const router = express.Router()
//创建路由处理请求
router.get("/update",(req,res)=>{ res.send("正在处理请求...")})
router.get("/get",(req,res)=>{
     res.cookie("username","admin",{maxAge:10000})
     res.send("设置Cookie")
    })
//将router暴露到模块外
module.exports = router