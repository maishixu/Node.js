const fs = require("node:fs")
const path = require("node:path")
// console.log(path.resolve(__dirname))
const buf = fs.readFileSync(path.resolve(__dirname,"./test.txt"))
console.log(buf);
