// const promise = new Promise((resolve,reject) => {
//     resolve("成功")
//     reject("失败")
// })
// promise.then(result =>{
//     console.log(result)
// },reason=>{
//     console.log(reason)
// })

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
function sum(a, b) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(a + b)
        }, 1000)

    })
}
sum(100, 200)
    .then(result => result + 300)
    .then(result => result + 400)
    .then(result => result + 500)
    .then(result => { console.log(result) })