## Express

是node中的服务器软件，通过express可以在node中快速搭建一个web服务器

### 一、基本使用

> 安装：`yarn install express`
>
> 初始化项目：`yarn init -y`

##### 创建服务器

```javascript
//引入express
const express = require("express")
//获取服务器的实例（对象）
const app = express()
//启动服务器
app.listen(3000,()=>{console.log("服务器已启动")})
/*访问服务器 http://127.0.0.1:3000*/
```

##### 设置路由

- 不同的路由用于处理各种请求 

```javascript
// '/'表示根目录
app.get("/",(req,res)=>{ 
    console.log("正在处理GET请求")
    //req 用于获取浏览器的请求信息
    //res 用于返回服务器的响应信息 
    res.sendStatus(404) //向浏览器发送响应状态码
})
```

##### 中间件

- 用于处理所有路由都需要做的公共事件(权限检查)
- 匹配所有类型请求，接收当前目录下所有子目录的请求

```javascript
app.use((req,res,next)=>{
    //处理找不到网页的情况
    res.status(404).send("访问网页不存在")
    next() //触发后续中间件，不能在响应处理后调用
})
```

- 小工具：nodemon

> 1. 使用nodemon启动服务器后，在项目中修改后不需要重启也能生效
> 2. 安装：`yarn add nodemon -D`
> 3. 启动服务器：`npx nodemon <入口文件>`

### 二、前后端交互

##### 访问静态资源

1. 首先在项目下创建一个public目录
2. 在public目录下新建一个index.html
3. 然后配置静态资源的路径

```javascript
//设置当前项目下的public目录为公开资源，默认渲染index.html
const path = require("node:path")
app.use(express.static(path.resolve(__dirname,"public")))
```

##### 简易登陆验证

- 前端

```html
<body>
    <!-- 浏览器登陆页面 -->
    <form action="/login" method="post"> <!-- 表示请求为post 处理路由为/login -->
        <div>用户名<input name="username" type="text"></div>
        <div>密码 <input name="password" type="password"></div>
        <div><input type="submit" value="登录"></div>
    </form>
</body>
```

- 后端

```javascript
//引入express
const express = require("express")
//获取服务器的实例（对象）
const app = express()
//启动服务器
app.listen(3000, () => { console.log("服务器已启动") })
//访问静态资源
const path = require("node:path")
app.use(express.static(path.resolve(__dirname, "public")))
//引入解析请求体中间件
app.use(express.urlencoded())
//服务器处理用户post请求登录
app.post("/login", (req, res) => {
    const username = req.body.username
    const password = req.body.password
    if (username === "admin" && password === "123123") {
        res.send("<h1>登陆成功！</h1>")
    } else {
        res.send("<h1>用户名或密码错误</h1>")
    }
})
```

注意：通过查询字符串（"/router"?id="18")传到服务器的值需要用req.query.id查询

##### 区别params和query

**req.params**

> 用于访问 URL 路径中的参数。通常用于路由中定义的参数。例如，`/users/:id` 中的 `:id` 是一个路径参数，可以通过 `req.params.id` 获取。

- 示例

  ```JavaScript
  app.get('/users/:id', (req, res) => {
      const userId = req.params.id; // 获取 URL 中的 id
      res.send(`User ID: ${userId}`);
  });
  //当用户访问 /user/123时，req.params.id就是123
  ```

**req.query**

> 用于访问 URL 查询字符串中的参数。适用于以 `?` 开头的查询字符串部分，常用于可选参数和过滤条件。例如，`/search?term=apple&page=2` 中的 `term` 和 `page` 是查询参数，可以通过 `req.query.term` 和 `req.query.page` 获取。

- 示例

  ```javascript
  app.get('/search', (req, res) => {
      const searchTerm = req.query.term; // 获取查询参数 term
      const page = req.query.page; // 获取查询参数 page
      res.send(`Search Term: ${searchTerm}, Page: ${page}`);
  });
  ```

### 三、模板引擎

HTML是静态页面，不能随服务器中的数据变化而变化，所以需要引入模板引擎，其可以嵌入服务器的变量，在网页中动态显示出来。

1. 安装：`yarn add epress-ejs`

2. 在项目中创建views目录，存放模板文件.ejs

3. 配置express的模板引擎为EJS

   ```javascript
   app.set("view engine","ejs")
   ```

4. 配置模板路径

   ```javascript
   app.set("views",path.resolve(__dirname,"views"))
   ```

5. 使用（在服务器代码中）

   ```javascript
   //访问页面时，自动渲染views目录下的模板引擎
   let name = "Frank"
   app.get("/",(req,res)=>{
       res.render("students",{name}) //name可以传到student.ejs模板中
   })
   //修改服务器内容，使静态页面变化
   app.get("/set_name",(req,res)=>{
       name = req.query.name
       res.send("修改成功")
   })
   ```

6. 使用（在浏览器代码中）

   ```html
   <body>
       <!-- 将render传入的值直接在网页中输出 -->
       <h1><%= name %></h1>
       <form action="./set_name">
           <input type="text" name="name" placeholder="pleace enter your name" >
           <button>submit</button>
       </form>
   </body>
   ```

### 四、路由(Router)

分离主文件服务器的基本结构和各种处理不同请求的路由代码，避免代码冗余，以方便维护

1. 在当前项目下创建一个routers文件夹，用于存放各种不同类别路由

2. 在router目录下创建处理用户操作的JS模块

   ```javascript
   /* user.js文件 */
   const express = require("express")
   //创建router对象
   const router = express.Router()
   //创建路由处理请求
   router.get("/update",(req,res)=>{ res.send("正在处理请求...")})
   //将router暴露到模块外
   module.exports = router
   ```

3. 在主文件下引入该模块

   ```javascript
   //index.js文件
   const userRouter = require("./routes/user")
   //使路由生效
   app.use(userRouter)
   app.use("/students",userRouter) //区别：要通过/students/update才能访问
   //上述三行代码的简写
   app.use("/students",require("./routes/user"))
   ```

