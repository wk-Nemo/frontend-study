const bucket = new WeakMap()
let activeEffect
const effectStack = []

function effect(fn, options = {}) {
    const effectFn = () => {
        cleanup(effectFn)
        activeEffect = effectFn
        effectStack.push(effectFn)
        // 将结果存储到res，并返回
        const res = fn()
        effectStack.pop()
        activeEffect = effectStack[effectStack.length - 1]
        return res
    }
    effectFn.options = options
    effectFn.deps = []
    // 只有非 lazy 时，才执行
    if(!options.lazy) {
        effectFn()
    }
    return effectFn
}

function computed(getter) {
    let value
    let dirty = true

    const effectFn = effect(getter, {
        lazy: true,
        // 如果触发track，就会执行调度，设置dirty为true，重新执行
        // 如股不触发track，不会执行调度，dirty保持false，取值缓存
        scheduler() {
            dirty = true
            // 手动触发函数响应
            trigger(obj, 'value')
        }
    })

    const obj = {
        get value() {
            if(dirty) {
                value = effectFn()
                dirty = false
            }
            // 手动追踪
            track(obj, 'value')
            return value
        }
    }

    return obj
}

function cleanup(effectFn) {
    for(let i = 0; i < effectFn.deps.length; i++) {
        const deps = effectFn.deps[i]
        deps.delete(effectFn)
    }
    effectFn.deps.length = 0
}

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

    activeEffect.deps.push(deps)
}

function trigger(target, key) {
    const depsMap = bucket.get(target)
    if(!depsMap) return
    const effects = depsMap.get(key)

    const effectsToRun = new Set()
    effects && effects.forEach(effectFn => {
        if(effectFn !== activeEffect) {
            effectsToRun.add(effectFn)
        }
    })
    effectsToRun.forEach(effectFn => {
        if(effectFn.options.scheduler) {
            effectFn.options.scheduler(effectFn)
        } else {
            effectFn()
        }
    })
}

const data = {
    foo: 1,
    bar: 2
}

const obj = new Proxy(data, {
    get(target, key) {
        track(target, key)
        return target[key]
    },
    set(target, key, newVal) {
        target[key] = newVal
        trigger(target, key)
    }
})

const sumRes = computed(() => {
    const value = obj.foo + obj.bar
    return value
})

effect(() => {
    console.log(sumRes.value)
})

obj.foo++



// effect(() => {
//     console.log(sumRes.value)
// })

// obj.foo++

