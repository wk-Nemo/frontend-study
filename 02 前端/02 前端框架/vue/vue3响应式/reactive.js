const { track, trigger, ITERATE_KEY } = require('./effect')

function createReactive(obj, isShallow = false, isReadOnly = false) {
    return new Proxy(obj, {
        // 拦截属性读取
        get(target, key, receiver) {
            // 让代理对象可以通过 raw 访问原始数据
            if(key === 'raw') {
                return target
            }
            // 只读状态下没有必要建立依赖 && 不和 symbol 类型建立响应联系
            if(!isReadOnly && typeof key !== 'symbol') {
                // 捕获依赖
                track(target, key)
            }
            //得到原始结果
            const res = Reflect.get(target, key, receiver)
            // 浅响应直接返回res
            if(isShallow) {
                return res
            }
            // 深响应需要递归调用 reactive
            if(typeof res === 'object' && res !== null) {
                return isReadOnly ? readOnly(res) : reactive(res)
            }
            return res
        },
        // 拦截 in 判断原型
        has(target, key) {
            track(target, key)
            return Reflect.has(target, key)
        },
        // 拦截 for in 循环
        ownKeys(target) {
            const key = Array.isArray(target) ? 'length' : ITERATE_KEY
            track(target, key)
            return Reflect.ownKeys(target)
        },
        // 拦截新增和修改属性
        set(target, key, newVal, receiver) {
            if(isReadOnly) {
                console.warn(`属性 ${key} 是只读的`)
                return true
            }

            const oldVal = target[key]
            // 判断 set 是新增还是修改
            const type = Array.isArray(target)
                ? Number(key) < target.length ? 'SET' : 'ADD'
                : Object.prototype.hasOwnProperty.call(target, key) ? 'SET' : 'ADD'
            // 设置属性
            const res = Reflect.set(target, key, newVal, receiver)
    
            // 确定 receiver 是被代理的对象
            if(target === receiver.raw) {
                // 新值和老值不同时（注意新老值为NaN的情况），绑定依赖
                if(oldVal !== newVal && (oldVal === oldVal || newVal === newVal)) {
                    trigger(target, key, type, newVal)
                }
            }
    
            return res
        },
        // 拦截删除属性
        deleteProperty(target, key) {
            if(isReadOnly) {
                console.warn(`属性 ${key} 是只读的`)
                return true
            }

            const hasKey = Object.prototype.hasOwnProperty.call(target, key)
            const res = Reflect.deleteProperty(target, key)
    
            // 只有删除的属性是自己的，且删除成功时，才触发更新
            if(hasKey && res) {
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

function shallowReadObly(obj) {
    return createReactive(obj, true, true)
}

module.exports = {
    reactive,
    shallowReactive,
    readOnly,
    shallowReadObly
}
