// 定义一个array的拦截器
const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)
[
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
].forEach(function (method) {
    const original = arrayProto[method]
    Object.defineProperty(arrayMethods, method, {
        value: function mutator (...args) {
            return original.apply(this, args)
        },
        enumerable: false,
        writable: true,
        configurable: true
    })
})

// 为了不污染全局的Array，我们希望只拦截那些被侦探了变化的数组
// 在Observer中使用拦截器覆盖那些即将被转换成响应式Array类型的数据原型
export class Observer {
    constructor (value) {
        this.value = value
        if (Array.isArray(value)) {
            // 有些浏览器不支持__proto__，在vue中使用了暴力的方法，将arrayMethods的方法直接设置到侦测的数组上
            value.__proto__ = arrayMethods
        } else {
            this.walk(value)
        }
    }
}