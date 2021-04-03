function instanceOf(left, right) {
  let proto =left.__proto__
  while (1) {
    console.log(proto)
    if (proto === null) return false
    if (proto === right.prototype) {
      return true
    }
    proto = proto.__proto__
  }
}

let arr = [1, 2, 3]
console.log(instanceOf(arr, Array))