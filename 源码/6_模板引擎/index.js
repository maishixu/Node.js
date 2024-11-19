//引入express
const express = require("express")
//路径
const path = require("path")
//获取服务器的实例（对象）
const app = express()
//引入解析请求体中间件
app.use(express.urlencoded())
//启动服务器去
app.listen(3000, () => { console.log("服务器已启动") })
//设置模板引擎
app.set("view engine", "ejs")
//配置模板路径
app.set("views", path.resolve(__dirname, "views"))
//访问页面时，自动渲染模板引擎
let name = "Frank"
app.get("/", (req, res) => {
    res.render("name", { name })
})
//修改服务器内容，使静态页面变化
app.get("/set_name", (req, res) => {
    name = req.query.name
    res.send("修改成功")
})

//练习，表格
const fs = require("fs/promises") //用于后续写文件
let STUDENT_ARR = require(path.resolve(__dirname, "./data/data.json")) //从文件中调数据
//渲染主页
app.get("/students", (req, res) => {
    res.render("students", { STUDENT_ARR })
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
            res.redirect("/students") //重定向
        }).catch((err) => {
            console.log("处理错误", err);
        })
})
//删除
/*
    1.点击修改链接
    2.向路由发送请求
    3.设置路由处理修改
        -获取删除的id
        -删除id学生
        -将新的数组写入文件
        -重定向
*/
app.get("/delete", (req, res) => {
    let id = +req.query.id //从模板引擎传过来的查询字符串要用query查询
    STUDENT_ARR = STUDENT_ARR.filter((person) => person.id !== id)
    fs.writeFile(path.resolve(__dirname, "./data/data.json"), JSON.stringify(STUDENT_ARR)) //转为字符串填入JSON文件
        .then(() => {
            console.log("删除成功")
            res.redirect("/students") //重定向
        }).catch((err) => {
            console.log("处理错误", err);
        })
})
//修改

//点击修改链接，跳转到修改页面
app.get("/update", (req, res) => {
    let id = +req.query.id
    const person = STUDENT_ARR.find((Person) => Person.id === id) //返回元素，而非数组
    res.render("update", { person })
})
//提交修改
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
        res.redirect("/students") //重定向
    }).catch((err) => {
        console.log("处理错误", err);
    })
})
app.use((req,res,next)=>{
    //处理找不到网页的情况
    res.status(404).send("访问网页不存在")
    next() //触发后续中间件，不能在响应处理后调用
})