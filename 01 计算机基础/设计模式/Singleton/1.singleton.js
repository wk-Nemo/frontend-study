var Singleton = function(name) {
  this.name = name
}

Singleton.instance = null

Singleton.prototype.getName = function() {
  console.log(this.name)
}

Singleton.getInstance = function(name) {
  if(!this.instance) {
    this.instance = new Singleton(name)
  }

  return this.instance
}

var a = Singleton.getInstance('event1')
var b = Singleton.getInstance('event2')

console.log(a === b)