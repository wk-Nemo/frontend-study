// 这是面试字节的问题，描述如下：
// on相当于订阅一个消息
// run相当于发布一个消息
// once 是订阅后，发布第一次可以接受消息，后面就不再执行
// class Even {
//   clientList{}
//   on(type, fn) {}
//   run(type) {}
//   off(type) {}
//   once(type, fn) {}
// }

let Even = {
  clientList: {},
  onceList: {},
}
Even.on = function(type, fn) {
  if (!this.clientList[type]) {
    this.clientList[type] = [];
  }
  this.clientList[type].push(fn);
}
Even.run = function(type) {
  let fns = this.clientList[type];
  let fnsOnce = this.onceList[type];
  
  if(!fns && !fnsOnce) return;
  if (fns) {
    for (let i = 0; i < fns.length; i++) {
      fns[i].apply(this, Array.prototype.slice(arguments, 1))
    }
  }
  if (fnsOnce) {
    for (let i = 0; i < fnsOnce.length; i++) {
      fnsOnce[i].apply(this, Array.prototype.slice(arguments, 1))
    }
    this.onceList = []
  }
}
Even.off = function(type) {
  this.clientList[type] = []
}
Even.once = function(type, fn) {
  if (!this.onceList[type]) {
    this.onceList[type] = []
  }
  this.onceList[type].push(fn);
}

Even.on('a', fn = function() {
  console.log('a')
})

Even.once('b', function() {
  console.log('b')
})

Even.run('a') // a
Even.run('b') // b
Even.run('b') // 第二次，不执行
Even.run('a') // a
Even.off('a') // 卸载a
Even.run('a') // a已被卸载，不执行
