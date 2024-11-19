// function sum(a, b) {
//     return new Promise(resolve => {
//         setTimeout(() => {
//             resolve(a + b)
//         }, 1000)

//     })

// }
// async function fn() {
//     let result = await sum(10, 20)
//     result = await sum(result, 30)
//     result = await sum(result, 40)
//     result = await sum(result, 50)
//     console.log(result)
// }
// fn()
async function fn() {
    console.log(1)
    console.log(2)
    await console.log(3);
    console.log(4);
    console.log(5)
}
fn()
console.log(6)