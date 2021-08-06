function defineReactive (data, key, val) {
  let dep = new Dep();
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get: function() {
      dep.depend();
      return val;
    },
    set: function(newVal) {
      if (newVal === val) {
        return
      }
      val = newVal
      dep.notify()
    }
  })
}

class Dep {
  constructor () {
    this.subs = []
  }

  // 添加订阅
  addSub(sub) {
    this.subs.push(sub)
  }

  // 取消订阅
  removeSub(sub) {
    for (let i = 0; i < this.subs.length; i++) {
      if (this.subs[i] === sub) {
        this.subs.slice(i, 1)
      }
    }
  }

  depend() {
    if (window.target) {
      this.addSub(window.target)
    }
  }

  notify() {
    const subs = this.subs.slice()
    for (let i = 0; i < subs.length; i++) {
      subs[i].update()
    }
  }
}

class Watcher {
  constructor(vm, exp, cb) {
    this.vm = vm;
    this.exp = exp;
    this.cb = cb;
    this.value = this.get(); // 将自己添加到订阅器
  }

  get() {
    window.target = this; // 全局变量 订阅者 赋值
    let value = this.getter.call(this.vm, this.vm) // 强制执行监听器里的get函数,将window.target添加到Dep中
    window.target = undefined; // 全局变量 订阅者 释放
    return value;
  }

  update() {
    const oldValue = this.value;
    this.value = this.get()
    this.cb.call(this.vm, this.val, this.oldValue);
  }
}

