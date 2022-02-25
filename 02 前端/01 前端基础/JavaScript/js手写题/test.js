// instanceof
function myInstanceof (left, right) {
  if (typeof left !== 'object' || right == null) {
    return false;
  }
  let proto = Object.getPrototypeOf(left);
  while (true) {
    if (proto == null) {
      return false;
    }
    if (proto == right.prototype) {
      return true;
    }
    proto = Object.getPrototypeOf(proto);
  }
}

// 函数的arguments为什么不是数组？如何转化成数组？

function argToArr() {
  var arr1 = Array.prototype.slice.call(arguments)
  console.log(Array.isArray(arr1));

  var arr2 = Array.prototype.concat.call([], arguments)
  console.log(Array.isArray(arr2));

  var arr3 = [...arguments]
  console.log(Array.isArray(arr3));

  var arr4 = Array.from(arguments)
  console.log(Array.isArray(arr4));

  return
}

// 数组去重

// let arr = [1, 2, 2, 1, 3, 4, 5, 6, 4, 2]

function arrDelRepeat1(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) {
        arr.splice(j, 1);
      }
    }
  }
  return arr;
}

function arrDelRepeat2(arr) {
  return [...new Set(arr)]
}

function arrDelRepeat3(arr) {
  let myArr = []
  for (let i = 0; i < arr.length; i++) {
    if (myArr.indexOf(arr[i]) == -1) {
      myArr.push(arr[i]);
    }
  }
  return myArr;
}



// 数组扁平化
let arr = [1, [2, [3, [4, 5]]], 6];

// es6语法
function flat1(arr) {
  return arr.flat(Infinity);
}

// JSON + 正则
function flat2(arr) {
  let str = JSON.stringify(arr);
  str = str.replace(/(\[|\])/g, '');
  str = '[' + str + ']';
  return JSON.parse(str);
}

// 递归
function flat3(arr) {
  let result = []
  let fn = function (ary) {
    for (let i = 0; i < ary.length; i++) {
      let item = ary[i];
      if (Array.isArray(ary[i])) {
        fn(item)
      } else {
        result.push(item)
      }
    }
  }
  fn(arr)
  return result;
}

// reduce迭代
function flat4(arr) {
  return arr.reduce((pre, cur) => {
    return pre.concat(Array.isArray(cur) ? flat4(cur) : cur);
  }, [])
}

console.log(flat4(arr));


// 手动实现new

function newOperator(ctor, ...args) {
  if(typeof ctor !== 'function'){
    throw 'newOperator function the first param must be a function';
  }
  let obj = Object.create(ctor.prototype)
  let res = ctor.apply(obj, args)

  let isObject = typeof res === 'object' && res !== null;
  let isFunction = typeof res === 'function';
  return isObject || isFunction ? res : obj;
}

// 手动实现call
Function.prototype.call = function(context, ...args) {
  let context = context || window
  let fn = Symbol(fn);
  context.fn = this;

  let result = eval('context.fn(...args)');

  delete context.fn;
  return result;
}

// 手动实现apply
Function.prototype.apply = function(context, args) {
  let context = context || window
  context.fn = this;

  let result = eval('context.fn(...args)');

  delete context.fn;
  return result;
}

// 手动实现bind

Function.prototype.bind2 = function (context, ...args) {
  var self = this;

  var fNOP = function () {};

  var fBound = function () {
      var bindArgs = [...arguments];
      return self.apply(this instanceof fNOP ? this : context, args.concat(bindArgs));
  }

  fNOP.prototype = this.prototype;
  fBound.prototype = new fNOP();
  return fBound;
}


// 深拷贝和浅拷贝

// 手动实现一个Promise

// 实现Promise的 resolve、reject 和 finally

// 实现Promise的 all 和 race

// 删除
let arr = [1, 2, 3, 4, 5]
arr.splice(1, 1);
console.log(arr)

// 插入
let arr1 = [1, 2, 3, 4, 5]
arr1.splice(1, 0, 2.5)
console.log(arr1)

// 替换
let arr2 = [1, 2, 3, 4, 5]
arr2.splice(1, 1, 2.5)
console.log(arr2)