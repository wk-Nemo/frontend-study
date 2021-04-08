Array.prototype.reduce = function (callbackfn, initialValue) {
    // 异常处理，和 map 一样
  // 处理数组类型异常
  if (this === null || this === undefined) {
    throw new TypeError("Cannot read property 'reduce' of null or undefined");
  }
  // 处理回调类型异常
  if (Object.prototype.toString.call(callbackfn) != "[object Function]") {
    throw new TypeError(callbackfn + ' is not a function')
  }

  let O = Object(this)
  let len = O.length >>> 0
  let k = 0

  // 有一个判断数组是否为空的过程
  let accumulator = initialValue
  if (accumulator === undefined) {
    for (; k < len; k++) {
      if (k in O) {
        accumulator = O[k]
        k++
        break
      }
    }
  }
  if (k === len && accumulator === undefined) {
    throw new Error('Each element of the array is empty')
  }
  for (;k < len; k++) {
    if (k in O) {
      accumulator = callbackfn.call(undefined, accumulator, O[k], k ,O)
    }
  }
  return accumulator
}

const arr = [1, 2, 3, 4, 5]
console.log(arr.reduce((a, b) => {
  return a + b
}))