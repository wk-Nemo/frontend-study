const { effect, track, trigger } = require('./effect')

/**
 * watch 监听数据变化
 * @param {*} source 响应式数据
 * @param {*} cb 回调函数
 */
function watch(source, cb, options = {}) {
    let getter
    // source类型为函数，说明用户直接传递了 getter 函数，这时直接使用函数
    if(typeof source === 'function') {
        getter = source
    } 
    // 如果不是函数类型，调用traverse函数递归地读取
    else {
        getter = () => traverse(source)
    }

    let oldValue, newValue

    // 存储用户注册的过期回调
    let cleanup

    function onInvalidate(fn) {
        // 将过期回调存储到 cleanup 中
        cleanup = fn
    }

    // 调度器函数：每次数据变化时，触发回调函数
    const job = () => {
        // 执行副作用函数，得到的是新值
        newValue = effectFn()
        // 在调用回调函数前，先调用过期回调
        if(cleanup) {
            cleanup()
        }
        cb(newValue, oldValue, onInvalidate)
        // 更新旧值
        oldValue = newValue
    }

    // 开启lazy，把返回值存储到effectFn中以便后续手动调用
    const effectFn = effect(
        // 触发读取操作，建立联系
        () => getter(),
        {
            lazy: true,
            scheduler: () => {
                if(options.flush === 'post') {
                    const p = Promise.resolve()
                    p.then(job)
                } else {
                    job()
                }
            }
        }
    )

    // immediate为true时立即执行job，从而触发回调执行
    if(options.immediate) {
        // 此时是第一次执行，所以oldValue为undefined
        job()
    } else {
        // 手动触发，得到第一次执行的值。
        oldValue = effectFn()
    }
}

function traverse(value, seen = new Set()) {
    // 如果要读取的值是如下情况，则什么都不做
    // 1.数据是原始值
    // 2.已经被读取过了
    if(typeof value !== 'object' || value === null || seen.has(value)) return
    // 数据添加到 seen 中
    seen.add(value)
    // 暂时不考虑数组等其他结构
    // 假设value是对象，递归调用traverse处理对象等每一个值
    for(const key in value) {
        traverse(value[key], seen)
    }
    return value
}

const data = { foo: 1 }

const obj = new Proxy(data, {
    get(target, key) {
        track(target, key)
        return target[key]
    },
    set(target, key, newVal) {
        target[key] = newVal
        trigger(target, key)
        return true
    }
})

// watch(obj, () => {
//     console.log('数据变化了')
// }, {
//     immediate: true
// })

let finalData

watch(obj, async (newVal, oldValue, onInvalidate) => {
    let expired = false

    onInvalidate(() => {
        expired = true
    })

    const res = await fetch('/path/to/request')

    if(!expired) {
        finalData = res
    }
})

obj.foo++

setTimeout(() => {
    obj.foo++
}, 300)

setTimeout(() => {
    console.log(finalData)
}, 2000)

module.exports = {
    watch
}