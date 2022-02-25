class Promise {
  constructor(executor) {

    this.state = 'pending';
    this.value = undefined;
    this.reason = undefined;
    this.resolvedCallbacks = [];
    this.rejectedCallbacks = [];

    let resolve = value => {
      if (this.state === 'pending') {
        this.state = 'fulfilled';
        this.value = value;
        // 对应发布消息的动作，当状态改变时，通知所有的订阅者
        this.resolveCallbacks.forEach(fn => fn())
      }
    }

    let reject = reason => {
      if (this.state === 'pending') {
        this.state = 'reject';
        this.reason = reason;
        // 对应发布消息的动作，当状态改变时，通知所有的订阅者
        this.rejectedCallbacks.forEach(fn => fn())
      }
    }

    try {
      executor(resolve, reject)
    } catch {
      reject(err)
    }
  }

  then(onFulfilled, onRejected) {
    // onFulfilled返回一个普通的值，成功时直接等于 value => value
    onFulfilled = typeof onFulfilled ? onFulfilled : value => value
    // onRejected返回一个普通的值，失败时如果直接等于 value => value，
    // 则会跑到下一个then中的onFulfilled中，所以直接扔出一个错误reason => throw err
    onRejected = typeof onRejected ? onRejected : err => {throw err}
    let promise2 = new Promise((resolve, reject) => {
      

      // 对于同步事件，执行完后状态会马上改变
      // 所以执行传递进来的函数
      if (this.state === 'fulfilled') {
        // onFulfilled或onRejected不能同步被调用，必须异步调用。我们就用setTimeout解决异步问题
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject)
          } catch(e) {
            reject(e)
          }
        }, 0)
      }
      if (this.state === 'rejected') {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason)
            this.resolvedCallbacks(promise2, x, resolve, reject)
          } catch(e) {
            reject(e)
          }
        }, 0)
      }
      // 对于异步事件，第一次宏任务执行完毕以后任然是pending状态
      // 需要执行一个类似订阅的动作，当状态发生改变时，再依次执行
      if (this.state === 'pending') {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject)
          } catch(e) {
            reject(e)
          }
        }, 0)
        setTimeout(() => {
          try {
            let x = onRejected(this.reason)
            this.resolvedCallbacks(promise2, x, resolve, reject)
          } catch(e) {
            reject(e)
          }
        }, 0)
      }
    })
    return promise2;
  }
}

Promise.resolve = function(val) {
  return new Promise((resolve, reject) => {
    resolve(val)
  })
}

Promise.reject = function(reason) {
  return new Promise((resolve, reject) => {
    reject(reason)
  })
}

Promise.race = function(promises) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(resolve, reject)
    }
  })
}

Promise.all = function(promises) {
  let arr = []
  let i = 0
  function processData(index, data) {
    arr[index] = data;
    i++;
    if (i === arr.length) {
      resolve(arr)
    }
  }
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(data => {
        processData(i, data)
      }, reject)
    }
  })
}

function resolvePromise(promise2, x, resolve, reject){
  // 循环引用报错
  if(x === promise2){
    // reject报错
    return reject(new TypeError('Chaining cycle detected for promise'));
  }
  // 防止多次调用
  let called;
  // x不是null 且x是对象或者函数
  if (x != null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      // A+规定，声明then = x的then方法
      let then = x.then;
      // 如果then是函数，就默认是promise了
      if (typeof then === 'function') { 
        // 就让then执行 第一个参数是this   后面是成功的回调 和 失败的回调
        then.call(x, y => {
          // 成功和失败只能调用一个
          if (called) return;
          called = true;
          // resolve的结果依旧是promise 那就继续解析
          resolvePromise(promise2, y, resolve, reject);
        }, err => {
          // 成功和失败只能调用一个
          if (called) return;
          called = true;
          reject(err);// 失败了就失败了
        })
      } else {
        resolve(x); // 直接成功即可
      }
    } catch (e) {
      // 也属于失败
      if (called) return;
      called = true;
      // 取then出错了那就不要在继续执行了
      reject(e); 
    }
  } else {
    resolve(x);
  }
}

console.log(5)
let p = new Promise(() => {
  setTimeout(() => {
    console.log(1)
  })
})
  .then(() => {
    console.log(2)
  })
  .then(() => {
    console.log(3)
  })

setTimeout(() => {
  console.log(6)
})
console.log(4)




setTimeout(()=>{ 
  console.log('1') 
  Promise.resolve().then(()=>{ 
    console.log('2')     
  }) 
},0); 
Promise.resolve().then(()=>{ 
  console.log('3')   
  setTimeout(()=>{ 
    console.log('4') 
  },0) 
}); 
new Promise((resolve) => {
  console.log(5)
  resolve()
}).then(() => {
  console.log(6)
  return new Promise((resolve) => {
    console.log(7)
    resolve()
  })
}).then(() => {
  console.log(8)
})
console.log(9); 


async function async1() {
  console.log('async1 start')
  await async2()
  console.log('async1 end')
}

async function async2() {
  console.log('async2')
}

console.log('script start')

setTimeout(function() {
  console.log('setTimeout')
}, 0)

async1()

new Promise(function(resolve) {
  console.log('promise1')
  resolve()
}).then(function () {
  console.log('promise2')
})

console.log('script end')