// 发布者，售楼处
var salesOffices = {}
// 缓存列表，存放订阅者的回调函数
salesOffices.clientList = []
// 订阅消息添加进缓存列表
salesOffices.listen = function(fn) {
  this.clientList.push(fn)
}
// 发布消息
salesOffices.trigger = function() {
  for (var i = 0, fn; fn = this.clientList[i]; i++) {
    fn.apply(this, arguments)
  }
}

// 小明订阅消息
salesOffices.listen(function(price, squareMeter) {
  console.log('price = ' + price);
  console.log('squareMeter' + squareMeter);
});
// 小红订阅消息
salesOffices.listen(function(price, squareMeter) {
  console.log('price = ' + price);
  console.log('squareMeter' + squareMeter);
})

salesOffices.trigger(20000, 88)
// price = 20000
// squareMeter88
// price = 20000
// squareMeter88