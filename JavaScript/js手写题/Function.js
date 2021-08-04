// 闭包的实现
function a() {
  let age = 1
  return function b() {
    console.log(age);
  }
}
let c = a()
c()

let age = 1;
function a(fn) {
  let age = 2;
  fn()
}
function b() {
  console.log(age)
}
a(b);


// 函数柯里化

// 参数固定
function add(fn) {
  let args = []
  return function _c(...newArgs) {
    if (args.length < fn.length - 1) {
      args = [...args, ...newArgs];
      return _c;
    } else {
      args = [...args, ...newArgs];
      return fn.call(this, ...args)
    }
  }
}
function x (a, b, c, d, e) {
  return a + b + c + d + e;
}
let func = add(x)
console.log(func(1)(2)(3)(4)(5))

// 参数不固定
function add() {
  let args = []
  return function _c(...newArgs) {
    if (newArgs.length) {
      args = [...args, ...newArgs]
      return _c
    } else {
      return args.reduce((sum, item) => sum + item);
    }
  }
}
let func = add()
func(1)(2)(3)(4, 5)()

// this指向
function getAge() {
  console.log(this.age)
}
let obj = {
  age: 18,
  getAge,
}
obj.getAge()

// call
Function.prototype.myCall = function(context) {
  context = context || window;
  let fn = Symbol();
  context[fn] = this;

  let args = [...arguments]
  console.log(args)
  args.shift()
  let res = context[fn](...args);

  delete context[fn];
  return res;
}

// apply
Function.prototype.apply = function(context, args) {
  context = context || window;
  context.fn = this;

  let result;
  if (args) {
    result = context.fn(...args)
  } else {
    result = context.fn()
  }
  
  delete context.fn;
  return result
}

Function.prototype.bind = function(context) {
  let self = this
  let args = Array.prototype.slice.call(arguments, 1)
  context = context || window

  let func = function() {
    let funArgs = Array.prototype.slice.call(arguments)
    // 根据func的不同使用方法，绑定的this应该不同
    // 如果this是self的实例，则说明对func使用了new进行实例化，此时调用的环境就是this
    // 否则只是正常调用，绑定context即可
    return self.call(this instanceof self ? this : context, ...args, ...funArgs)
  }

  func.prototype = Object.create(this.prototype);
  return func
}


let Obj = {
  age: 18
}

function getAge() {
  console.log(this.age)
}

getAge.apply(Obj)
