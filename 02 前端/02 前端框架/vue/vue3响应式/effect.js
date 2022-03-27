// 存储单个副作用函数
let activeEffect
// 副作用函数栈，防止 effect 函数嵌套
let effectStack = []
// 存储每个响应式对象的副作用函数
const bucket = new WeakMap()

// 调用副作用函数
function effect(fn, options = {}) {
    const effectFn = () => {
        // 清楚所有与该副作用函数的依赖
        cleanup(effectFn)
        activeEffect = effectFn
        effectStack.push(effectFn)
        // 将fn的执行结果存储到res中
        const res = fn()
        effectStack.pop()
        activeEffect = effectStack[effectStack.length - 1]
        return res
    }
    // 相关选项
    // scheduler 为调度器，可以控制副作用函数执行的时机和次数
    effectFn.options = options
    // 存储所有与该副作用函数有关的依赖集合
    effectFn.deps = []
    // lazy为true，执行副作用函数
    if(!options.lazy) {
        effectFn()
    }
    return effectFn
}

function cleanup(effectFn) {
    for(let i = 0; i < effectFn.deps.length; i++) {
        const deps = effectFn.deps[i]
        deps.delete(effectFn)
    }
    effectFn.deps.length = 0
}

// 捕获调用
function track(target, key) {
    if(!activeEffect) return
    let depsMap = bucket.get(target)
    if(!depsMap) {
        bucket.set(target, (depsMap = new Map()))
    }
    let deps = depsMap.get(key)
    if(!deps) {
        depsMap.set(key, (deps = new Set()))
    }
    deps.add(activeEffect)

    // 将该依赖添加到与该副作用函数有关的数组中
    activeEffect.deps.push(deps)
}

// 设置触发器
function trigger(target, key) {
    const depsMap = bucket.get(target)
    if(!depsMap) return
    const effects = depsMap.get(key)

    // 直接执行effects中的代码可能出现无限执行的情况
    //   effectFn会先调用cleanup函数会将自身从依赖中去除
    //   注意此时forEach还没结束
    //   effectFn会将自身再添加到依赖中，造成无限执行
    const effectsToRun = new Set()
    effects && effects.forEach(effectFn => {
        // 如果 trigger 触发的副作用函数和当前正在执行的副作用函数相同，则不触发执行
        if(effectFn !== activeEffect) {
            effectsToRun.add(effectFn)
        }
    })
    effectsToRun.forEach(effectFn => {
        // 如果存在一个副作用函数调度器，则调用该调度器
        if(effectFn.options.scheduler) {
            effectFn.options.scheduler(effectFn)
        } else {
            // 否则直接执行副作用函数
            effectFn()
        }
    })
}

module.exports = {
    track,
    trigger,
    effect
}
