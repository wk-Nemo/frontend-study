## 0 JavaScript对象及Proxy的工作原理

### 内部方法

在js中，对象的实际语义由对象的内部方法指定。所谓内部方法就是当我们对一个对象进行操作时，引擎内部调用的方法，这些方法对于js使用者而言是不可见的。

对象必要的内部方法:

- `[[GetPrototypeOf]]`
- `[[SetPrototypeOf]]`
- `[[IsExtensible]]`
- `[[PreventExtensions]]`
- `[[GetOwnProperty]]`
- `[[DefineOwnProperty]]`
- `[[HasProperty]]`
- `[[Get]]`
- `[[Set]]`
- `[[Delete]]`
- `[[OwnPropertykeys]]`

额外的必要内部方法：

- `[[Call]]`
- `[[Construct]]`

### 常规对象和异质对象

js中的对象分为**常规对象**和**异质对象**。

**什么是常规对象呢？**

满足以下条件的是常规对象

- 必要的内部方法，必须使用ECMA规范10.1.x节给出的定义实现
- 内部方法`[[Call]]`，必须使用ECMA规范10.2.1节给出的定义实现
- 内部方法`[[Construct]]`，必须使用ECMA规范10.2.2节给出的定义实现

**什么是异质对象？**

任何不属于常规对象的对象都是异质对象。

### Proxy

Proxy也是对象，但它是一个异质对象。因为他内部方法`[[Get]]`没有使用ECMA规范10.1.8节给出的定义实现。

创建代理对象时指定的拦截函数，实际上是用来定义代理对象本身的内部方法和行为的，而不是用来指定被代理对象内部的方法和行为。下面给出Proxy对象部署的所有内部方法以及用来自定义内部方法和行为的拦截函数名字。

|内部方法|处理器函数|
|------|--------|
|`[[GetPrototypeOf]]`| `getPrototypeOf` |
|`[[SetPrototypeOf]]`|`setPrototypeOf`|
|`[[IsExtensible]]`|`isExtensible`|
|`[[PreventExtensions]]`|`preventExtensions`|
|`[[GetOwnProperty]]`|`getOwnPropertyDescriptor`|
|`[[DefineOwnProperty]]`|`defineProperty`|
|`[[HasProperty]]`|`has`|
|`[[Get]]`|`get`|
|`[[Set]]`|`set`|
|`[[Delete]]`|`deleteProperty`|
|`[[OwnPropertykeys]]`|`ownkeys`|
|`[[Call]]`|`apply`|
|`[[Construct]]`|`construct`|

举个例子，当我们要拦截删除属性时，我们可以使用`deleteProperty`拦截函数实现

```js
const obj = { foo: 1 }
const p = new Proxy(obj, {
    deleteProperty(target, key) {
        return Reflect.deleteProperty(target, key)
    }
})

console.log(p.foo) // 1
delete p.foo
console.log(p.foo) // 未定义
```

## 1 代理Object

前面我们在proxy中使用get拦截函数去拦截对属性的读取操作。但在响应式系统中，“读取”是一个很宽泛的概念，下面列出了对一个普通对象的所有可能的读取操作：

- `obj.foo`：访问属性
- `key in obj`：判断对象和原型上是否存在 key
- `for(const key in obj){}`：循环遍历对象
- `delete obj.foo`：删除属性

接下来，我们逐步讨论如何拦截这些读取操作。首先是对属性的读取，例如obj.foo，在前面我们已经通过get拦截函数实现。

```js
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
```

### Reflect & 访问属性

这里看似已经完美，但其实任然存在缺陷。Proxy只能拦截对一个对象的基本操作，上述代码在下述情况下将会暴露他的问题：

```js
const obj = {
    foo: 1,
    get bar() {
        return this.foo
    }
}

const p = new Proxy(obj, {...})

effect(() => {
    console.log(p.bar)
})
```

在这一段代码中，effect注册的副作用函数会读取p.bar属性，并发现这是一个getter属性，因此执行getter函数。由于getter函数中通过this.foo读取了foo属性，因此我们认为副作用函数与foo属性之间也会建立联系。**但事实并非如此，当我们尝试修改p.foo的值时，副作用函数并没有重新执行。**

问题就出在bar属性的访问器函数getter中，这里的this指向的是原始对象obj，而不是代理对象p。相当于执行了如下代码：

```JS
effect(() => {
    obj.foo
})
```

访问了原始的对象属性，因此不会建立起foo属性和副作用的响应关系。所以不论怎么修改foo属性，都不会再触发副作用函数。这时Reflect就派上用场了：

```js
const obj = new Proxy(data, {
    get(target, key, receiver) {
        track(target, key)
        return Reflect.get(target, key, receiver)
    },
    set(target, key, newVal) {
        target[key] = newVal
        trigger(target, key)
    }
})
```

**当我们使用代理对象p访问bar属性时，receiver就是p，此时getter函数bar内部的this便指向了代理对象p**，建立起了foo属性和p的响应关系。

### in & for in & delete

Proxy中没有对应的拦截in操作的函数，但是在ECMA-262规范的13.10.1中可以发现in操作符的运算结果是通过调用HasProperty的抽象方法得到的。而HasProperty抽象方法在ECMA-262规范中的7.3.11中，它的返回值是通过调用对象的内部方法`[[HasProperty]]`得到的，在Proxy中对应的拦截函数为has。因此我们可以使用has拦截函数实现对in操作符的代理:

```js
const obj = new Proxy(data, {
    get(target, key) {
        track(target, key, receiver)
        return Reflect.get(target, key, receiver)
    },
    set(target, key, newVal) {
        target[key] = newVal
        trigger(target, key)
    },
    has(target, key) {
        track(target, key)
        return Reflect.has(target, key)
    }
})
```

for in的拦截思路和in类似，可以使用ownKeys拦截：

```js
const INTERATE_KEY = Symbol()

const p = new Proxy(data, {
    get(target, key, receiver) {
        track(target, key)
        return Reflect.get(target, key, receiver)
    },
    set(target, key, newVal) {
        target[key] = newVal
        trigger(target, key)
    },
    has(target, key) {
        track(target, key)
        return Reflect.has(target, key)
    },
    ownKeys(target) {
        track(target, INTERATE_KEY)
        return Reflect.ownKeys(target)
    }
})
```

ownKeys用于获取一个对象所有属于自己的键值，这个操作显然不与任何具体的键进行绑定，因此我们只能构造唯一的key作为标识，即INTERATE_KEY。相应的，在触发响应时需要触发它才行：

- 为p添加新属性时，触发INTERATE_KEY对应的副作用函数
- 修改p已有的属性，不触发INTERATE_KEY对应的副作用函数

```js
const obj = new Proxy(data, {
    get(target, key, receiver) {
        track(target, key)
        return Reflect.get(target, key, receiver)
    },
    set(target, key, newVal, receiver) {
        // 判断是否是已有的属性
        const type = Object.prototype.hasOwnProperty.call(target, key) ? 'SET' : 'ADD'
        const res = Reflect.set(target, key, newVal, receiver)
        trigger(target, key, type)
        return res
    },
    has(target, key) {
        track(target, key)
        return Reflect.has(target, key)
    },
    ownKeys(target) {
        track(target, INTERATE_KEY)
        return Reflect.ownKeys(target)
    }
})

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
    if(type === 'ADD') {
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
```

delete操作符依赖[[Delete]]内部方法，而该内部方法可以使用deleteProperty拦截：

```js
const obj = new Proxy(data, {
    deleteProperty(target, key) {
        const hadKey = Object.prototype.hasOwnProperty.call(target, key)
        const res = Reflect.deleteProperty(target, key)

        if(res && hadKey) {
            trigger(target, key, 'DELETE')
        }

        return res
    }
})

function trigger(target, key, type) {
	...
    // 只有type为ADD，才触发与ITERATE_KEY相关联的副作用函数重新执行
    if(type === 'ADD' || type === 'DELETE') {
        interateEffects && interateEffects.forEach(effectFn => {
            if(effectFn !== activeEffect) {
                effectsToRun.add(effectFn)
            }
        })
    }
	...
}
```

## 2 合理地触发响应

首先我们将之前的proxy操作封装起来，方便我们进行后续的学习：

```js
function reactive(obj) {
    return new Proxy(obj, {
        get(target, key, receiver) {
            track(target, key)
            return Reflect.get(target, key, receiver)
        },
        set(target, key, newVal, receiver) {
            // 判断是否是已有的属性
            const type = Object.prototype.hasOwnProperty.call(target, key) ? 'SET' : 'ADD'
            const res = Reflect.set(target, key, newVal, receiver)
            trigger(target, key, type)
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
            const hadKey = Object.prototype.hasOwnProperty.call(target, key)
            const res = Reflect.deleteProperty(target, key)
    
            if(res && hadKey) {
                trigger(target, key, 'DELETE')
            }
    
            return res
        }
    })
}
```

### 值没有发生变化

当值没有发生变化时，应该不需要触发响应：

```js
function reactive(obj) {
    return new Proxy(obj, {
        set(target, key, newVal, receiver) {
            // 获取旧值
            const oldVal = target[key]
            // 判断是否是已有的属性
            const type = Object.prototype.hasOwnProperty.call(target, key) ? 'SET' : 'ADD'
            const res = Reflect.set(target, key, newVal, receiver)

            // NaN === NaN false
            // NaN !== NaN true
            if(oldVal !== newVal && (oldVal === oldVal || newVal === newVal)) {
                trigger(target, key, type)
            }
            return res
        }
    })
}
```

这里需要注意的是，判断两个值是否相等时需要注意NaN，需要oldValue和newValue都不是NaN时才可以认为两者不相等。

### 原型

基于现在的reactive，创建一个例子：

```js
const obj = {}
const proto = {bar:1}
const child = reactive(obj)
const parent = reactive(proto)
Object.setPrototypeOf(child, parent)

effect(() => {
    console.log(child.bar)
})

child.bar = 2
```

上述代码运行结果如下：

![image-20220828200807342](https://raw.githubusercontent.com/wk-Nemo/imgBed/main/imgimage-20220828200807342.png)

原因很简单，因为child和parent都是响应式的，且parent是child的原型。当effect中访问child.bar属性时，在child对象中找不到bar属性，于是便会在其原型parent中寻找bar属性，并触发parent对象的`[[get]]`内部方法，建立parent.bar和effect之间的依赖关系。设置属性原理同上，当设置的属性不存在于对象上时，会取得其原型，并调用原型的`[[set]]`。也就是说设置child.bar会导致parent代理对象的set拦截函数执行，所以上述代码在修改child.bar后会执行两次副作用函数。

解决上述问题的思路如下：屏蔽掉parent.bar触发的副作用函数，因此我们需要在set拦截函数上做一些处理。

```js
function reactive(obj) {
    return new Proxy(obj, {
        get(target, key, receiver) {
            // key值为raw时，返回receiver代理的对象
            if(key === 'raw') {
                return target
            }
            track(target, key)
            return Reflect.get(target, key, receiver)
        },
        set(target, key, newVal, receiver) {
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
        }
    })
}
```

设置bar属性时，child代理对象的set的参数receiver是其自己。但是由于obj上不存在bar属性，所以会取得obj的原型parent，并执行parent的拦截函数set，而此时的receiver任然是child。通过判断receiver代理的对象是否与当前target一致，便可以达到屏蔽掉parent.bar触发的副作用函数的目的。

### 深响应 & 浅响应

目前的代码只能做到浅响应，而不能做到深响应。拿如下代码来说：

```js
const obj = reactive({foo: { bar: 1 }})
effect(() => {
    console.log(obj.foo.bar)
})
obj.foo.bar = 2
```

修改bar属性的值不会触发副作用函数

![image-20220828224514752](https://raw.githubusercontent.com/wk-Nemo/imgBed/main/imgimage-20220828224514752.png)

解决该问题，需要我们对Refelect.get返回的结果做一层包装：

```js
function createReactive(obj, isShallow=false) {
    return new Proxy(obj, {
        get(target, key, receiver) {
            // key值为raw时，返回receiver代理的对象
            if(key === 'raw') {
                return target
            }
            // 建立依赖关系
            track(target, key)
            // 拿到值
            const res = Reflect.get(target, key, receiver)
            // 浅响应直接返回值
            if(isShallow) {
                return res
            }
            // 深度响应：如果res为对象，将该数据也包装成响应式
            if(typeof res === 'object' && res !== null) {
                return reactive(res)
            }

            return res
        },
        set(target, key, newVal, receiver) {
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
            const hadKey = Object.prototype.hasOwnProperty.call(target, key)
            const res = Reflect.deleteProperty(target, key)
    
            if(res && hadKey) {
                trigger(target, key, 'DELETE')
            }
    
            return res
        }
    })
}

// 深度响应
function reactive(obj) {
    return createReactive(obj)
}

// 浅响应
function shallowReactive(obj) {
    return createReactive(obj, true)
}
```

### 只读 & 浅制度

有些数据我们希望它是只读的，当用户尝试修改时，会受到警告信息。这里，我们为createReactive添加第三个参数isReadonly：

```js
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
```



## 3 代理数组

数组是一个异质对象，因为数组的 `[[DefineOwnProperty]]` 的内部方法和常规对象不同。也就是说，除了 `[[DefineOwnProperty]]` 外，其余的内部方法与常规的对象相同，所以我们代理普调对象的大部分方法可以继续在数组对象上使用。

对数组的元素或属性的读取操作有：

- 通过索引访问数组元素：arr[0]
- 访问数组长度：arr.length
- for in 循环
- for of 迭代遍历数组
- 不改变原数组的原型方法：concat/join/every/some/find/findIndex/includes等

对数组元素或属性的设置操作：

- 通过索引修改数组元素值：arr[1] = 3
- 修改长度：arr.length = 0
- 栈方法：push/pop/shift/unshift
- 原型方法：splice/fill/sort

## 4 代理Set和Map



## 5 原始值响应方案

























