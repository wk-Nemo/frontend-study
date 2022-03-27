const { effect, track, trigger } = require('./effect')

function computed(getter) {
    // 缓存上一次的值
    let value
    // 用来标识是否需要重新计算
    //    1. true意味着“脏”，需要重新计算
    let dirty = true

    const effectFn = effect(getter, {
        lazy: true,
        // 1. 当被拦截的对象触发 getter 后，不会执行 effectFn，只会设置 dirty 为 true
        //    当 computed 返回的 obj 内容再次被访问时，会执行 effectFn
        // 2. 当被拦截的对象没有触发 getter，dirty 依然为false
        //    当 computed 返回的 obj 内容再次被访问时，不会执行 effectFn
        //    返回的值任然是上次存储的 value
        scheduler() {
            dirty = true
            // 当计算属性依赖的响应式数据变化时，手动调用 trigger 函数触发响应
            trigger(obj, 'value')
        }
    })

    const obj = {
        get value() {
            if(dirty) {
                value = effectFn()
                dirty = false
            }
            // 当读取 value 时，手动调用 track 函数进行追踪
            track(obj, 'value')
            return value
        }
    }

    return obj
}

module.exports = {
    computed
}