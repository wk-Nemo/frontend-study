Function.prototype.call = function(context, ...args) {
  context = context || window
  const fn = this

  context.fn = fn
  const res = context.fn(...args)

  delete context.fn
  return res
}


Function.prototype.apply = function (context, ...args) { 
  context = context || window
  console.log(context)
  const fn = this
  console.log(fn)

  context.fn = fn
  console.log(context.fn)
  const res  =context.fn(...args[0])

  delete context.fn
  return res
}

Function.prototype.bind = function (context, ...args) {
  context = context || window
  const fn = this

  context.fn = fn

  // bind和call、apply的区别
  return function () {
    const res = context.fn(...args)
    delete context.fn
    return res
  }
}


function fn1() {
  console.log(this, arguments)
  console.log(1)
}

function fn2() {
  console.log(this, arguments)
  console.log(2)
}

function fn3() {
  console.log(this.a)
}

const obj = {
  a: 1
}

// fn1.call(fn2, 1, 2)
// fn3.apply(obj, [1])
let res = fn3.bind(obj, 1, 2)
res()