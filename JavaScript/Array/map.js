Array.prototype.map = function (callbackFn, thisArg) {
  // 处理数组类型异常
  if (this === null || this === undefined) {
    throw new TypeError("Cannot read property 'map' of null or undefined")
  }

  // 处理回调类型异常
  if (Object.prototype.toString.call(callbackFn) != '[object Function]') {
    throw new TypeError(callbackFn + "is not a function")
  }

  // 把数组转换成对象
  let O = Object(this)
  let T = thisArg

  // 保证len为数字且为整数
  let len = O.length >>> 0
  let A  = new Array(len)
  // 大致遍历一边属性，每个属性执行一次回调函数得到值添加到新数组中
  for (let k = 0; k < len; k++) {
    if (k in O) {
      let kValue = O[k]
      let mappedValue = callbackFn.call(T, kValue, k, O)
      A[k] = mappedValue
    }
  }
  return A
}

const arr = [1, 2, 3, 4, 5]
console.log(arr.map(item => item + 1))

