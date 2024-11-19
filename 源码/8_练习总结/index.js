const express = require("express")
const path = require("path")
const app = express()
const fs = require("fs/promises") //用于后续写文件

app.use(express.urlencoded())
//设置模板引擎
app.set("view engine", "ejs")
app.set("views", path.resolve(__dirname, "views"))
//引入session
const session = require("express-session")
const Filestore = require("session-file-store")(session)
app.use(session({ 
    store:new Filestore({
        path:path.resolve(__dirname,"./sessions")
    }),//存在本地
    secret: "test"
 }))

app.listen(3000, () => {
    console.log("已启动服务器")
})
let STUDENT_ARR = require(path.resolve(__dirname, "./data/data.json")) //从文件中调数据


app.get("/login", (req, res) => {
    res.render("login_paper")
})

app.post("/login-server", (req, res) => {
    if (req.body.username === "admin" && req.body.password === "123123") {
        req.session.loginUser = req.body.username
        req.session.save(()=>{ //先存，在重定向
            res.redirect("/list")
        })
        
    } else {
        res.redirect("/login") //重定向指的是重定向路由
    }
})
app.use((req,res,next)=>{
    if(req.session.loginUser){
        next()
    }else{
        res.redirect("/login")
    }
})
app.get("/list",(req,res)=>{  
    res.render("students",{STUDENT_ARR})
})
//添加
app.post("/add_family", (req, res) => {
    const id = STUDENT_ARR.at(-1) ? STUDENT_ARR.at(-1).id + 1 : 1
    const newPerson = {
        id,
        name: req.body.name,
        age: +req.body.age,
        gender: req.body.gender,
        address: req.body.address,
    }
    STUDENT_ARR.push(newPerson)
    //去除旧的内容，写入新的内容
    fs.writeFile(path.resolve(__dirname, "./data/data.json"), JSON.stringify(STUDENT_ARR)) //转为字符串填入JSON文件
        .then(() => {
            console.log("添加成功")
            res.redirect("/list") //重定向
        }).catch((err) => {
            console.log("处理错误", err);
        })
})
//删除
app.get("/delete", (req, res) => {
    let id = +req.query.id //从模板引擎传过来的查询字符串要用query查询
    STUDENT_ARR = STUDENT_ARR.filter((person) => person.id !== id)
    fs.writeFile(path.resolve(__dirname, "./data/data.json"), JSON.stringify(STUDENT_ARR)) //转为字符串填入JSON文件
        .then(() => {
            console.log("删除成功")
            res.redirect("/list") //重定向
        }).catch((err) => {
            console.log("处理错误", err);
        })
})
//修改
app.post("/update-submit",(req,res)=>{
    const {id,name,age,gender,address} = req.body
    const person = STUDENT_ARR.find((person)=>person.id == id) //改对象，修改后原来的对象也会改变，因为指向的是同一个地址
    person.name = name
    person.age = +age
    person.gender = gender
    person.address = address
    fs.writeFile(path.resolve(__dirname, "./data/data.json"), JSON.stringify(STUDENT_ARR)) //转为字符串填入JSON文件
    .then(() => {
        console.log("修改成功")
        res.redirect("/list") //重定向
    }).catch((err) => {
        console.log("处理错误", err);
    })
})
app.get("/update", (req, res) => {
    let id = +req.query.id
    const person = STUDENT_ARR.find((Person) => Person.id === id) //返回元素，而非数组
    res.render("update", { person })
})
//退出
app.get("/logout",(req,res)=>{
    req.session.destroy(()=>{
        res.redirect("/login")
    })
})