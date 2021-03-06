var CreateDiv = function(html) {
  this.html = html
  this.init()
}

CreateDiv.prototype.init = function() {
  var div = document.createElement('div')
  div.innerHTML = this.html
  document.body.appendChild(div)
}

var proxySingletonCreateDiv = (function() {
  var instance
  return function(html) {
    if(!instance) {
      instance = new CreateDiv(html)
    }

    return instance
  }
})()

var a = new proxySingletonCreateDiv('sven1')
var b = new proxySingletonCreateDiv('sven2')
console.log(a === b)