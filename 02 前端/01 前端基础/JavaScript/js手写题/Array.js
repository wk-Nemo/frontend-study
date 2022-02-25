Array.prototype.map = function(callback, thisArg) {
  const res = []

  const O = Object(this);
  const len = O.length >>> 0;

  for (let i = 0; i < len; i++) {
    if (i in O) {
      res.push(callback.call(thisArg, O[i], i, this))
    }

  }
  return res;
}

// const arr = [1, 2, 3, 4]
// const arr1 = arr.forEach((item) => {
//   return item + 1
// })
// console.log(arr)

Array.prototype.forEach = function (callback, thisArg) {
  const O = Object(this)
  const len = O.length >>> 0

  for (let i = 0; i < len; i++) {
    if (i in O) {
      callback.call(thisArg, O[i], i, this);
    }
  }
}

Array.prototype.filter = function (callback, thisArg) {
  const res = []
  const O = Object(this)
  const len = O.length >>> 0

  for (let i = 0; i < len; i++) {
    if (i in O) {
       if (callback.call(thisArg, O[i], i, this)) {
         res.push(O[i])
       }
    }
  }

  return res;
}

Array.prototype.reduce = function (callback, initialValue) {
  const O = Object(this)
  const len = O.length >>> 0
  if (len == 0) {
    return false;
  }
  let accumulator = initialValue ? initialValue : O[0]

  for (let i = 1; i < len; i++) {
    if (i in O) {
      accumulator = callback.call(undefined, accumulator, O[i], i, this)
    }
  }

  return accumulator
}

const arr = [1, 2, 3, 4]
const result = arr.reduce((accumulator, item) => {
  return accumulator + item;
})
console.log(result)