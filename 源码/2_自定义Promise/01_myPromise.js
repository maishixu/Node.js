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
    #reject(reason) {

    }
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