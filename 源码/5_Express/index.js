//引入express
const express = require("express")
const path = require("node:path")
//获取服务器的实例（对象）
const app = express()
//启动服务器
app.listen(3000, () => { console.log("服务器已启动") })
//访问服务器 http://127.0.0.1:3000

// //设置不同的路由处理各种请求
// app.get("/",(request,response)=>{
//     console.log("正在处理GET请求")
//     //request:浏览器的请求信息
//     //response：服务器的响应信息 
//     response.sendStatus(200) //向浏览器发送响应状态码
// })
// //中间件
// app.use((req,res,next)=>{
//     //匹配所有请求
//     //接收当前目录下所有子目录的请求
//     res.send("<h1>中间件</h1>")
//     // next() //触发后续中间件，不能在响应处理后调用
// })

//访问静态资源
app.use(express.static(path.resolve(__dirname, "public")))
// //服务器处理用户get登录
// app.get("/login", (req, res) => {
//     console.log("用户正在登录");
//     if (req.query.username === "Frank" && req.query.password === "888888") {
//         res.send("<h1>登陆成功</h1>")
//     } else {
//         res.send("<h1>用户名或密码错误</h1>")
//     }
// })
//

//服务器处理用户post登录

// 用户库
const USERS = [
    {
        username: "Frank",
        password: "123123",
        nickname: "宇宙无敌大酒鬼"
    },
    {
        username: "Fiona",
        password: "666888",
        nickname: "南区最好大姐"
    },
    {
        username: "Mandy",
        password: "909090",
        nickname: "纯爱无敌曼迪"
    },
]
//引入解析请求体中间件
app.use(express.urlencoded())
//登录
app.post("/login", (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const loginUser = USERS.find(item => {
        return item.username === username && item.password === password
    })
    if (loginUser !== undefined) {
        res.send(`<h3>登陆成功！${loginUser.nickname}</h3>`)
    } else {
        res.send("<h3>用户名或密码错误！</h3>")
    }
})
//注册
app.post("/rigister", (req, res) => {
    const { username, password, repwd, nickname } = req.body
    const user = USERS.find(item => {
        return item.username === username || item.nickname === nickname
    })
    if (!user) {
        if (password !== repwd) {
            res.send("<h3>两次输入的密码不一致！</h3>")
        } else {
            USERS.push({
                username,
                password,
                nickname
            })
            res.send("<h3>恭喜您，注册成功</h3>")
        }
    } else {
        res.send("您输入的用户名已存在！")
    }
})
