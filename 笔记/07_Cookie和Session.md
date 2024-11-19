## Cookie

​	Cookie用于解决HTTP协议中无状态问题的技术

> 1. 安装：`yarn add cookie-parser`
> 2. 引入：`const cookieParser = require("cookie-parser")`
> 3. 设置中间件：`app.use(cookieParser())`

- 服务器给浏览器发送Cookie

  ```javascript
  app.set("/set",(req,res)=>{
  	res.cookie("username","admin",{ maxAge:1000 }) 
      //键值对形式Cookie = username:admin 有效时长：1000ms
  })
  ```

- 当下次浏览器访问当前服务器时（无论哪个路由）都会携带着Cookie

  ```javascript
  app.get("/get",(req.res)=>{
  	//读取浏览器发挥的Cookie
  	console.log(req.cookies)
  	console.log(req.cookie.username)
  })
  ```

- Cookie的缺点

  ​	不能存较多的数据（否则流量过慢）；存储在客户端，且是明文明文存储，容易被篡改利用。

## Session

​	解决Cookie的缺点；ID存在浏览器，ID对应的数据存在服务器。

- session就是服务器中用来存储用户数据的对象。每个Session有唯一ID，通过这个ID来取数据

- 一定注意，session是在服务器中的，要访问的话要用res

- 使用

  > 下载：`yarn add express-session`
  >
  > 引入：`const session = require("express-session")`
  >
  > 设置中间件：`app.use(session({ secret:"crypto"}))`

- 当浏览器访问该服务器时即可获得一个ID，下次再访问时会携带这个ID

- 那怎么往这个ID对应的服务器中的session对象中添加数据呢？

  ```javascript
  app.get("/",(req,res) => {
  	req.session.username = "admin" //访问服务器时，给对应的session对象传值
  	res.session //服务器会根据访问的用户ID自动读取其session对象
  })
  ```

- session的失效时间

  1. 浏览器的cookie失效（默认情况cookie在浏览器关闭后失效：一次会话）
  2. 服务器的session失效（默认存储在内存中，服务器重启时失效）

- 将session存储到文件中

  1. 安装：`yarn add session-file-store`

  2. 引入：`const Filestore = require("session-file-store")(session)`

  3. 设置中间件：

     ```javascript
     app.use(
         session({
             store:new Filesore({
                 path:path.resolve(__dirname,"./sessions"), //配置存储路径
                 secret:"key_word", //加密保存
                 ttl:3600, //有效时间:s
                 reapInterval:1000 //清除过期session的间隔
             }), 
             secret:"crypto", 
             cookie:{ maxAge:1000*3600} //ms
         })
     })
     ```

  4. 销毁session（登出功能）

     ```javascript
     app.get("/logout",(req,res)=>{
     	req.session.destroy(()=>{ //销毁当前用户的session
     		res.redirect("/")
     	})
     })
     ```

     