// 存储单个副作用函数
let activeEffect
// 副作用函数栈，防止 effect 函数嵌套
let effectStack = []
// 存储每个响应式对象的副作用函数
const bucket = new WeakMap()
// for in 循环绑定的依赖值
const ITERATE_KEY = Symbol()

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
    // lazy为false，执行副作用函数
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
function trigger(target, key, type, newVal) {
    // 取得和 target 相关联的副作用函数
    const depsMap = bucket.get(target)
    if(!depsMap) return

    // 取得和 key 相关联的副作用函数
    const effects = depsMap.get(key)

    // 直接执行effects中的代码可能出现无限执行的情况
    //   effectFn会先调用cleanup函数会将自身从依赖中去除
    //   注意此时forEach还没结束
    //   effectFn会将自身再添加到依赖中，造成无限执行
    const effectsToRun = new Set()
    // 将 effects 添加到 effectsToRun
    effects && effects.forEach(effectFn => {
        // 如果 trigger 触发的副作用函数和当前正在执行的副作用函数相同，则不触发执行
        if(effectFn !== activeEffect) {
            effectsToRun.add(effectFn)
        }
    })

    // 只有新增属性才出发 for in 的依赖，减少了不必要的性能消耗
    if(type === 'ADD' || type === 'DELETE') {
        // 取得和 ITERATE_KEY 相关联的副作用函数
        const interateEffects = depsMap.get(ITERATE_KEY)
        // 将 interateEffects 添加到 effectsToRun
        interateEffects && interateEffects.forEach(effectFn => {
            // 如果 trigger 触发的副作用函数和当前正在执行的副作用函数相同，则不触发执行
            if(effectFn !== activeEffect) {
                effectsToRun.add(effectFn)
            }
        })
    }

    // 考虑数组元素改变会影响数组长度
    if(type === 'ADD' && Array.isArray(target)) {
        const lengthEffects = depsMap.get('length')
        lengthEffects && lengthEffects.forEach(effectFn => {
            // 如果 trigger 触发的副作用函数和当前正在执行的副作用函数相同，则不触发执行
            if(effectFn !== activeEffect) {
                effectsToRun.add(effectFn)
            }
        })
    }

    // 考虑数组的长度的变化会影响数组元素
    if(Array.isArray(target) && key === 'length') {
        // 当数组的长度改变时，所有比长度大的下标都应该拿出来重新执行
        depsMap.forEach((effects, key) => {
            if(key >= newVal) {
                effects.forEach(effectFn => {
                    if(effectFn !== activeEffect) {
                        effectsToRun.add(effectFn)
                    }
                })
            }
        })
    }
    
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
    effect,
    ITERATE_KEY
}
