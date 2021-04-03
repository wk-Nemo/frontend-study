// Object.create()：该方法可以指定原型对象和属性，返回一个新的对象。
Object.create = function (proto, propertyObject = undefined) { 
  if (typeof proto !== 'object' && typeof proto !== 'function') {
    throw new TypeError('Object prototype may only be an Object or null.')
  }
  if (propertyObject === null) {
    new TypeError('Cannot convert undefined or null to object')
  }
  function F() {}
  F.prototype = proto
  const obj = new F()
  if (propertyObject != undefined) {
    Object.defineProperties(obj, propertyObject)
  }
  if (proto === null) {
    obj.__pro__ = null
  }
  return obj
}