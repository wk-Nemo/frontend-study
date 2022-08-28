const bucket = new WeakMap()
let activeEffect
const effectStack = []
const INTERATE_KEY = Symbol()

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

function trigger(target, key, type) {
    const depsMap = bucket.get(target)
    if(!depsMap) return
    const effects = depsMap.get(key)
    const interateEffects = depsMap.get(INTERATE_KEY)

    const effectsToRun = new Set()
    effects && effects.forEach(effectFn => {
        if(effectFn !== activeEffect) {
            effectsToRun.add(effectFn)
        }
    })

    // 只有type为ADD，才触发与ITERATE_KEY相关联的副作用函数重新执行
    if(type === 'ADD' || type === 'DELETE') {
        interateEffects && interateEffects.forEach(effectFn => {
            if(effectFn !== activeEffect) {
                effectsToRun.add(effectFn)
            }
        })
    }

    effectsToRun.forEach(effectFn => {
        if(effectFn.options.scheduler) {
            effectFn.options.scheduler(effectFn)
        } else {
            effectFn()
        }
    })
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

function watch(source, cb, options) {
    let getter
    if(typeof source === 'function') {
        getter = source
    } else {
        getter = () => traverse(source)
    }

    // 递归读取，建立依赖关系
    function traverse(value, seen = new Set()) {
        if(typeof value !== 'object' || value ===null || seen.has(value)) return
        seen.add(value)
        for(const k in value) {
            traverse(value[k], seen)
        }

        return value
    }

    let newValue, oldValue
    let cleanup // 存储过期函数
    function onInvalidate(fn) {
        cleanup = fn
    }
    // 提取公共逻辑
    const job = () => {
        newValue = effectFn()
        // 调用回调函数之前，先调用过期回调
        if(cleanup) {
            cleanup()
        }
        // onInvalidate作为第三个参数供用户使用
        cb(newValue, oldValue, onInvalidate)
        oldValue = newValue
    }

    const effectFn = effect(
        () => getter(),
        {
            lazy: true,
            // 数据变化时，触发回调函数
            scheduler: () => {
                if(opeions.flush === 'post') {
                    const p = Promise.resolve()
                    p.then(job)
                } else {
                    job()
                }
            }
        }
    )

    // immediate为true立即执行回调
    if(options.immediate) {
        job()
    } else {
        oldValue = effectFn()
    }
}

function createReactive(obj, isShallow=false, isReadOnly=false) {
    return new Proxy(obj, {
        get(target, key, receiver) {
            // key值为raw时，返回receiver代理的对象
            if(key === 'raw') {
                return target
            }
            // 只读情况下无法修改属性，因此没有必要建立依赖关系
            if(!isReadOnly) {
                // 建立依赖关系
                track(target, key)
            }
            // 拿到值
            const res = Reflect.get(target, key, receiver)
            // 浅响应直接返回值
            if(isShallow) {
                return res
            }
            // 深度响应：如果res为对象，将该数据也包装成响应式
            if(typeof res === 'object' && res !== null) {
                return isReadOnly ? readOnly(res) : reactive(res)
            }

            return res
        },
        set(target, key, newVal, receiver) {
            // 只读属性判断
            if(isReadOnly) {
                console.warn(`属性${key}只读`)
                return true
            }
            const oldVal = target[key]
            // 判断是否是已有的属性
            const type = Object.prototype.hasOwnProperty.call(target, key) ? 'SET' : 'ADD'
            const res = Reflect.set(target, key, newVal, receiver)

            // target是receiver代理的对象
            if(target === receiver.raw) {
                // NaN === NaN false
                // NaN !== NaN true
                if(oldVal !== newVal && (oldVal === oldVal || newVal === newVal)) {
                    trigger(target, key, type)
                }
            }
            
            return res
        },
        has(target, key) {
            track(target, key)
            return Reflect.has(target, key)
        },
        ownKeys(target) {
            track(target, INTERATE_KEY)
            return Reflect.ownKeys(target)
        },
        deleteProperty(target, key) {
            // 只读属性判断
            if(isReadOnly) {
                console.warn(`属性${key}只读`)
                return true
            }

            const hadKey = Object.prototype.hasOwnProperty.call(target, key)
            const res = Reflect.deleteProperty(target, key)
    
            if(res && hadKey) {
                trigger(target, key, 'DELETE')
            }
    
            return res
        }
    })
}

function reactive(obj) {
    return createReactive(obj)
}

function shallowReactive(obj) {
    return createReactive(obj, true)
}

function readOnly(obj) {
    return createReactive(obj, false, true)
}

// 浅响应直接通过控制isShallow参数即可
function shallowReadOnly(obj) {
    return createReactive(obj, true, true)
}
// const obj = {}
// const proto = {bar:1}
// const child = reactive(obj)
// const parent = reactive(proto)
// Object.setPrototypeOf(child, parent)

// effect(() => {
//     console.log(child.bar)
// })

// child.bar = 2







const obj = reactive({foo: { bar: 1 }})
effect(() => {
    console.log(obj.foo.bar)
})
obj.foo.bar = 2
