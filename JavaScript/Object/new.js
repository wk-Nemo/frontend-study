function objectFactory() {
  // 创建一个新对象
  var obj = new Object()
  // 第一个参数是传入的构造函数
  Constructor = Array.prototype.shift.call(arguments)
  // 对象的原型指向构造函数原型
  obj.__proto__ = Constructor.prototype
  // 将属性值赋给对象
  var ret = Constructor.apply(obj, arguments)
  // 返回结果
  return typeof ret === 'obj' ? ret || obj : obj
}

function person(name, age) {
  this.name = name
  this.age = age
} 

let p = objectFactory(person, '布兰', 12)
console.log(p)