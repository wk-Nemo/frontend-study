function debounce(fn) {
  let t = null;
  return function () {
    if (t) {
      clearTimeout(t)
    }
    //注意此处改成箭头函数，因为直接使用函数argument会指向自身的实参列表
      //而不是return的函数的列表
      //apply绑定了this指向了return的函数，并将return的函数的参数列表传给了fun
    t = setTimeout(() => {
      fn.apply(this, arguments)
    }, 1000)
  }
}

function throttle(fn, delay) {
  var begin = 0;
  return function() {
    var cur = new Date().getTime()
    if ((cur - begin) > delay) {
      fn.apply(this)
      begin = cur
    }
  }
}