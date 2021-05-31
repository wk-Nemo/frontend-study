var { Dep } = require('./observer')
/*
*  vm：一个 Vue 的实例对象；
*  exp：是 node 节点的 v-model 等指令的属性值 或者插值符号中的属性。如 v-model="name"，exp 就是name;
*  cb：是 Watcher 绑定的更新函数;
*/
function Watcher(vm, exp, cb) {
  this.vm = vm;
  this.exp = exp;
  this.cb = cb;
  this.value = this.get();  // 将自己添加到订阅器的操作
}

Watcher.prototype = {
  update: function() {
    this.run();
  },
  run: function() {
    var value = this.vm.data[this.exp];
    var oldVal = this.value;
    if (value !== oldVal) {
        this.value = value;
        this.cb.call(this.vm, value, oldVal);
    }
  },
  get: function() {
      Dep.target = this; // 全局变量 订阅者 赋值
      var value = this.vm.data[this.exp]  // 强制执行监听器里的get函数,触发数据对象的 getter。
      Dep.target = null; // 全局变量 订阅者 释放
      return value;
  }
};

module.exports = Watcher;