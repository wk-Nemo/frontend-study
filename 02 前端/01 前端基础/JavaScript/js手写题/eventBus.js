const eventBus = () => {
  this.subs = new Map()
  return {
    $on: function(type, callback) {
      const sub = subs.get(type)
      if (!sub) {
        sub = []
        subs.set(type, sub)
      }
      sub.push(callback)
    },
    $emit: function(type) {
      const sub = subs.get(type)
      const args = Array.prototype.slice.call(arguments, 1)
      sub.forEach(fn => fn(args))
    },
    $off: function(type, callback) {
      const sub = subs.get(type)
      const pos = sub.indexOf(callback)
      if (pos !== -1) {
        sub.splice(pos, 1)
      }
    }
  }
}