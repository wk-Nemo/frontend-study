/*主要是闭包的相关知识*/
// 返回函数
const a = 2
function out () {
  let a = 1
  return function b () {
    console.log(a)
  }
}

const b = out()
b()

// 函数当作参数传递
var a = 1
function foo() {
  var a =2
  function baz() {
    console.log(a)
  }
  bar(baz)
}

function bar(fn) {
  var a = 2
  fn()
}

foo()

// 定时器
setTimeout(function timeHandler(){
  console.log('111');
}, 100)

// 事件监听
$('#app').click(function(){
  console.log('DOM Listener');
})

// 立即执行函数
var a = 2
(function IIFE(){
  a = 1
  console.log(a);
})()

// 区分上下文和作用域链
// 作用域声明时就决定好了
// 上下文执行时再确定
var a = 2
var obj = {
  a: 1,
  foo: function() {
    console.log(a)
  }
}
obj.foo()

