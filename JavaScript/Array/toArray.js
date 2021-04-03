// 函数参数转数组(类数组转换成数组)
function sum1(a, b) {
    let args = Array.prototype.slice.call(arguments)
    console.log(args.reduce((sum, cur) => sum + cur))
}

function sum2(a, b) {
    let args = Array.from(arguments)
    console.log(args.reduce((sum, cur) => sum + cur))
}

function sum3(a, b) {
    let args = [...arguments]
    console.log(args.reduce((sum, cur) => {
        return sum.concat(cur)
    }, []))
}

function sum4(a, b) {
    let args = Array.prototype.concat.apply([], arguments)
    console.log(args.reduce((sum, cur) => sum + cur))
}





