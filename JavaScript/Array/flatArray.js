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

// format("3[a]2[bc]") => "aaabcbc"
function format(str) {
  const arr = str.replace(/(\[|\])/g,',').split(',')
  let result = []
  for (let i = 0; i < arr.length - 1; i++) {
    if ( i % 2 === 0) {
      let num = Number(arr[i])
      for(let j = 0; j < num; j++) {
        result.push(arr[i+1])
      }
    }
  }
  return result.join('')
}
const str1 = "3[a]2[bc]4[def]"
console.log(format(str1))