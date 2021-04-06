// 函数柯里化

// 提高适应性

// 延迟执行
// var add = function () {
//   var _this = this
//   _args = arguments
//   return function () {
//     if(!arguments.length) {
//       var sum = 0
//       for (var i = 0, c; c = _args[i]; i++) {
//         sum += c
//       }
//       return sum
//     } else {
//       Array.prototype.push.apply(_args, arguments) 
//       return arguments.callee
//     }
//   }
// }

// console.log(add(1)(2)(3)(4)(5))
// function add (a, b, c, d) {
//   return [...arguments].reduce((a, b) => a + b)
// }

// function currying(fn) {
//   let len = fn.length
//   let args = []
//   return function _c (...newArgs) {
//     args = [...args, ...newArgs]
//     if (args.length < len) {
//       return _c
//     } else {
//       return fn.apply(this, args)
//     }
//   }
// }
// let addCurry = currying(add)
// let total = addCurry(1)(2)(3)(4)
// console.log(total)

function add (...args) {
  return args.reduce((a, b) => a + b)
}

function currying(fn) {
  let args = []
  return function _c (...newArgs) {
    if (newArgs.length) {
      args = [...args, ...newArgs]
      return _c
    } else {
      return fn.apply(this, args)
    }
  }
}

let addCurry = currying(add)
let total = addCurry(1)(2)(3, 4)(5, 6 ,7)()
console.log(total)