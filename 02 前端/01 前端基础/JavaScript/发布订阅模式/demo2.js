/**
 * 上一种发布订阅模式，不管发布者发布了说明，只要订阅者订阅，就会接收到相关的消息
 * 这明显不合理，每个人都有自己想要的消息，因此在这个示例中为订阅者的缓存进行一个分类
 */
// 发布者，售楼处
var salesOffices = {}
// 缓存列表，存放订阅者的回调函数
salesOffices.clientList = {}

// 将订阅的不同的信息加入各自的进缓存列表
salesOffices.listen = function(key, fn) {
  if (!this.clientList[key]) {
    this.clientList[key] = []
  }
  this.clientList[key].push(fn)
}

// 发布消息
salesOffices.trigger = function(key) {
  var fns = this.clientList[key];

  if (!fns || fns.length === 0) {
    return;
  }
  
  var args = Array.prototype.slice.call(arguments, 1);
  for(var i = 0; i < fns.length; i++) {
    fns[i].call(this, ...args);
  }
}

// 小明订阅88平米的房子
salesOffices.listen('squareMeter88', function(price, squareMeter) {
  console.log('price = ' + price);
});

// 小红订阅消息110平米的房子
salesOffices.listen('squareMeter110', function(price, squareMeter) {
  console.log('price = ' + price);
})

salesOffices.trigger('squareMeter88', 20000, 88) // price = 20000
salesOffices.trigger('squareMeter110', 30000, 110) // price = 30000