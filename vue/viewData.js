// let val = 'Tom'
// let person = {}
// Object.defineProperty(person, 'name', {
//   get () {
//     console.log('name has been read')
//     return val
//   },
//   set (newVal) {
//     console.log('name has been changed')
//     val = newVal
//   }
// })
function Dep () {
  this.subs = []
}
Dep.prototype = {
  addSub: function(sub){
    this.subs.push(sub)
  },
  notify: function(){
    this.subs.forEach(function(sub){
      sub.update()
    })
  }
}

function observable(obj) {
  if (!obj || typeof obj !== 'object') {
    return;
  }
  let keys = Object.keys(obj)
  keys.forEach((key) => {
    defineReactive(obj, key, obj[key])
  })
  return obj
}

function defineReactive(obj, key, val){
  var dep = new Dep()
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function getter() {
      if (Dep.target) {
        dep.addSub(Dep.target)
      }
      return val
    },
    set: function setter (newVal) {
      if (newVal === val) {
        return;
      }
      val = newVal
      dep.notify()
    }
  })
}

function Watcher(vm, exp, cb) {
  this.vm = vm
  this.exp = exp
  this.cb = cb
  this.val = this.get()
}

Watcher.prototype = {
  update: function() {
    this.run()
  },
  run: function(){
    var value = this.vm.data[this.exp]
    var oldVal = this.value
    if (value !== oldVal) {
      this.value = value
      this.cb.call(this.vm, value, oldVal)
    }
  },
  get: function(){
    Dep.target = this
    var value = this.vm.data[this.exp]
    Dep.target = null
    return value
  }
}




