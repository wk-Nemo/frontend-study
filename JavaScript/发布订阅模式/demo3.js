/**
 * 上一个示例中我们写死了一个salesOffices对象，我们希望对象可以进行复用，
 * 如果出现了第二个售楼处，我们也希望有一样的发布订阅的效果，所以将发布订阅的功能进行一个提取的过程
 */

var even= {
  clientList: {},
  listen: function(key, fn) {
    if (!this.clientList[key]) {
      this.clientList[key] = []
    }
    this.clientList[key].push(fn)
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
var salesOffices2 = {}
installEvent(salesOffices1);
installEvent(salesOffices2);


// 小明订阅售楼处1的88平米房子
salesOffices1.listen('squareMeter88', function(price, squareMeter) {
  console.log('price = ' + price);
});

// 小明订阅售楼处2的110平米房子
salesOffices2.listen('squareMeter110', function(price, squareMeter) {
  console.log('price = ' + price);
})

salesOffices1.trigger('squareMeter88', 20000, 88) // price = 20000
salesOffices1.trigger('squareMeter110', 20000, 110) 
salesOffices2.trigger('squareMeter88', 30000, 88)
salesOffices2.trigger('squareMeter110', 30000, 110) // price = 30000