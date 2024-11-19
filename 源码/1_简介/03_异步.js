function sum(a,b,fn){
    setTimeout(()=>{
        fn(a+b)
    },5000)
}
sum(100,200,(result)=>{
    console.log(result)
})