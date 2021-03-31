// 函数参数转数组
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


// 数组扁平化
let ary = [1, [2, [3, [4, 5]]], 6];
let str = JSON.stringify(ary)
// 转换成JSON，然后用正则替换掉[],最后转成数组
ary1 = str.replace(/(\[|\])/g,'').split(',')

// 递归实现
let result = []
function re(ary) {
    for (let i = 0; i < ary.length; i++) {
        let item = ary[i]
        if (Array.isArray(item)) {
            re(item)
        } else {
            result.push(item)
        }
    }
}
re(ary)
console.log(result)

// reduce
function flatten(ary) {
    return ary.reduce((pre, cur) => {
        return pre.concat(Array.isArray(cur) ? flatten(cur) : cur)
    }, [])
}


// 高级函数

// map
let nums = [1, 2, 3];
let obj = {val: 5};
let newNums = nums.map(function(item,index,array) {
  return item + index + array[index] + this.val; 
  //对第一个元素，1 + 0 + 1 + 5 = 7
  //对第二个元素，2 + 1 + 2 + 5 = 10
  //对第三个元素，3 + 2 + 3 + 5 = 13
}, obj);
console.log(newNums);//[7, 10, 13]

// reduce上面已经用到了

// filter

// sort很常见

