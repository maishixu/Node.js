## Promise

用来存储异步代码的返回结果，解决回调函数的不便性

### Promise用法

- 创建Promise对象

  Promise的数据只能被修改一次，禁止重复修改

```javascript
const promise = new Promise((resolve,reject)=>{
    //Promise构造函数的回调函数，在创建Promise对象时执行
    resolve("successData") //执行正常时存储数据
    reject("failData") //执行错误时存储数据
})
```

- 读取Promise数据

```javascript
promise.then(
    result => {"回调函数参数，处理正常代码"},//result -> resolve中存储的数据
    reason => {"回调函数参数，处理异常代码"} //reason -> reject中存储的数据
)
```

- 专门处理异常方法

```javascript
promise.catch(reason => {})
//相当于
promise.then(null,reason => {})
```

- 最终处理

```javascript
promise.finally(() => {})//无论是否成功都会执行
```

- Promise解决回调地狱
  1. 回调函数接收异步返回值：

```javascript
function sum(a, b, cb) {
    setTimeout(() => {
        cb(a + b)
    }, 1000)
}
sum(100, 200, (result) => {
    sum(result, 300, (result) => {
        sum(result, 400, (result) => {
            sum(result, 500, (result) => {
                console.log(result)
            })
        })
    })
})
```

​	2. Promise接收异步返回值：

```javascript
function sum(a, b) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(a + b)
        }, 1000)

    })
}
//值得注意的是，.then方法会返回一个新的Promise，这个新的Promise中会存储回调函数的返回值
sum(100, 200)
    .then(result => result + 300)
    .then(result => result + 400)
    .then(result => result + 500)
    .then(result => { console.log(result) })
```

- Promise的静态方法
  1. Promise.resolve && Promise.reject：立即执行的Promise
  2. Promise.all：同时返回多个Promise执行结果，其中一个报错，则返回错误
  3. Promise.allSettled：同时返回多个Promise执行结果，无论对错
  4. Promise.race：返回执行最快的Promise，无论对错
  5. Promise.any：返回最快成功的Promise，若所有都错，则返回错误

```javascript
Promise.all([sum(1,2),sum(10,20),sum(100,200)]).all(result()=>{
	console(result) //[3,30,300]
})
```

### 宏任务和微任务

- 栈

​	后进先出，放的是即将执行的代码（全局作用域）

- 队列

  先进先出，放的是异步执行的代码，栈空了才会开始执行

  - 宏任务队列 > 大部分异步代码

  - 微任务队列 > Promise的方法

  - queueMicrotask方法 > 向微任务队列中添加一个任务

- 练习

  阅读下面代码，写出执行结果

```javascript
console.log(1)
setTimeout(() => { console.log(2); })
Promise.resolve().then(() => console.log(3))
Promise.resolve().then(() => setTimeout(() => console.log(4)))
Promise.resolve().then(() => console.log(5))
setTimeout(() => { console.log(6) })
console.log(7)
// 1 7 3 5 2 6 4
// 方法:先排栈，微任务，宏任务。先执行栈，再执行微任务，发现微任务中有宏任务，插入到宏任务末尾，最后执行宏任务
```

### 自定义Promise

```javascript
//记录Promise状态
const PROMISE_STATE = {
    PENDING: 0,
    FULFILLED: 1,
    REJECTED: 2
}
class MyPromise {
    #result //存储Promise结果
    #state = PROMISE_STATE.PENDING //状态
    #callbacks = []
    //执行器
    constructor(executor) {
        executor(this.#resolve.bind(this), this.#reject.bind(this))
        //绑定this，确保this指向实例属性
    }

    //成功时存储数据
    #resolve(value) {
        //若状态不等于0，说明已经被修改过
        if (this.#state !== PROMISE_STATE.PENDING) return
        this.#result = value
        this.#state = PROMISE_STATE.FULFILLED

        //等待异步的数据读进来后，调用then
        queueMicrotask(() => {
            this.#callbacks.forEach(cb => {
                cb()
            })
        })
    }
    //失败时存储数据
    #reject(reason) {}
    //读取数据的方法
    then(onFulfilled, onRejected) {
        return new MyPromise((resolve, reject) => {
            //读取异步数据
            if (this.#state === PROMISE_STATE.PENDING) {
                this.#callbacks.push(() => {
                    resolve(onFulfilled(this.#result)) //读取后同时将then的返回值给新的Promise
                })
            }
            //读取同步数据
            else if (this.#state === PROMISE_STATE.FULFILLED) {
                queueMicrotask(() => {
                    resolve(onFulfilled(this.#result))
                })
            }
        })
    }
}
//(resolve,reject)=>{ } 等于 executor(this.#resolve.bind(),this.#reject.bind())
const mp = new MyPromise((resolve, reject) => {
    resolve("成功")
})
//测试多次调用then
mp.then((result) => {
    console.log("1", result);
})
mp.then((result) => {
    console.log("2", result);
})
//测试连续调用then
mp.then((result) => {
    console.log("3", result);
    return "success"
}).then(result => {
    console.log("4", result)
})
```

### async和await

Promise语法糖，以同步的形式调用异步代码

- async

  自动创建一个异步函数，其返回值会自动封装到一个Promise中返回

- await

  1. 作用：在异步函数中等待异步代码的结果
  2. 可用性：在async声明的异步函数中，或者es模块的顶级作用域

- 例子：解决回调地狱

```javascript
function sum(a, b) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(a + b)
        }, 1000)

    })

}
async function fn() {
    let result = await sum(10, 20)
    result = await sum(result, 30)
    result = await sum(result, 40)
    result = await sum(result, 50)
    console.log(result)
}
fn()
```

- async中没有await，则代码会依次执行，出现await，则后面的语句加入微任务中

```javascript
async function fn() {
    console.log(1)
    console.log(2)
    await console.log(3);//阻塞↓代码，放入微任务队列
    console.log(4);
    console.log(5)
}
fn()
console.log(6)
//输出：1 2 3 6 4 5
```
