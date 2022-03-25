const arrayProto = Array.prototype
const arrayMethods = Object.create(arrayProto)

let a = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse',
].forEach(function (method) {
  const original = arrayProto[method]
  Object.defineProperty(arrayMethods, method, {
    value: function mutator(...args) {
      return original.apply(this, args)
    },
    enumerable: true,
    writable: true,
    configurable: true,
  })
})

function defineReactive (data, key, val) {
  // 递归对象属性
  if (typeof val === 'object') {
    new Observer(val)
  }
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

class Observer {
  constructor(value) {
    this.value = value

    if (Array.isArray(value)) {
      value.__proto__ = arrayMethods
    } else {
      this.walk(value)
    }
  }

  walk(obj) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i], obj[keys[i]])
    }
  }
}
