/* 数组去重 */

var arr = [1,3,5,7,9,1,3,5,7]

// 使用indexOf()
function noRepeat1(arr) {
  const result = []
  for (let i = 0; i < arr.length; i++) {
    if (result.indexOf(arr[i]) === -1) {
      result.push(arr[i])
    }
  }
  return result
}
console.log(noRepeat1(arr))

// 使用set特性，然后将set转换成数组
// 转换数组的方式有很多：扩展运算符、Array.from()、Array.prototype.slice.call、Array.prototype.concat.apply([], arguments)

function noRepeat2(arr) {
  const set = new Set(arr)
  const result = [...set]
  return result
}
console.log(noRepeat2(arr))