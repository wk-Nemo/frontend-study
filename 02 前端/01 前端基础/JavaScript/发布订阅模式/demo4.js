/**
 * 有时我们不希望继续订阅某个消息了，还要进行一个取消订阅
 */

 var even= {
  clientList: {},
  listen: function(key, fn) {
    if (!this.clientList[key]) {
      this.clientList[key] = []
    }
    this.clientList[key].push(fn)
  },
  remove: function(key, fn) {
    var fns = this.clientList[key];
    
    if (!fn) {
      fns && (fns.length = 0);
    } else {
      for (let i = 0; i < fns.length; i++) {
        if (fn === fns[i]) {
          fns.splice(i, 1)
        }
      }
    }
  },
  trigger: function(key) {
    var fns = this.clientList[key];
  
    if (!fns || fns.length === 0) {
      return;
    }
    
    var args = Array.prototype.slice.call(arguments, 1);
    console.log(fns.length)
    for(var i = 0; i < fns.length; i++) {
      fns[i].call(this, ...args);
    }
  }
}

var installEvent = function(obj) {
  for (var i in even) {
    if (typeof even[i] === 'object') {
      obj[i] = JSON.parse(JSON.stringify(even[i]))
    } else {
      obj[i] = even[i];
    }
  }
}

var salesOffices1 = {}
installEvent(salesOffices1);


// 小明订阅售楼处1的88平米房子
salesOffices1.listen('squareMeter88', fn1 = function(price, squareMeter) {
  console.log('price = ' + price);
});
salesOffices1.trigger('squareMeter88', 20000, 88) // price = 20000

salesOffices1.remove('squareMeter88', fn1);
salesOffices1.trigger('squareMeter88', 20000, 88)

