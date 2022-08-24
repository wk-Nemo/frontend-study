## 0 调度执行

可调度性是响应式系统非常重要的特性，它是指当`trigger`触发副作用函数重新执行时，有能力决定副作用函数执行的时机、次数和方式。实现可调度性，可以为用户设计一个选择参数`options`，它允许客户指定调度器：

```js
// 为副作用函数新增选项入口
function effect(fn, options = {}) {
    const effectFn = () => {
        cleanup(effectFn)
        activeEffect = effectFn
        effectStack.push(effectFn)
        fn()
        effectStack.pop()
        activeEffect = effectStack[effectStack.length - 1]
    }
    // 将options挂在到effectFn上
    effectFn.options = options
    effectFn.deps = []
    effectFn()
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
        // 如果副作用函数存在调度器，则调用该调度器
        if(effectFn.options.scheduler) {
            effectFn.options.scheduler(effectFn)
        } else {
            // 否则直接执行副作用函数
            effectFn()
        }
    })
}
```

一、有了调度器，我们可以控制副作用函数执行的时机

```javascript
const data = {
    foo: 1
}

const obj = new Proxy(data, {...})

effect(
    () => { console.log(obj.foo) }
)

obj.foo += 2

console.log(2)
```

上述代码没有加入调度器，执行结果如下：

![image-20220724144941211](https://raw.githubusercontent.com/wk-Nemo/imgBed/main/imgimage-20220724144941211.png)

给副作用函数添加调度器，如下：

```js
effect(
    () => { console.log(obj.foo) },
    {
        scheduler(fn) {
            setTimeout(fn)
        }
    }
)
```

重新执行代码结果如下：

![image-20220724145439211](https://raw.githubusercontent.com/wk-Nemo/imgBed/main/imgimage-20220724145439211.png)

通过配置`scheduler`，使用`setTimeout`开启了一个宏任务来执行副作用函数，对副作用函数的**再次执行的时机**进行了控制。

二、有了调度器，我们可以控制副作用函数执行的次数

```js
effect(
    () => { console.log(obj.foo) },
)

obj.foo++
obj.foo++
```

该代码的执行结果如下：

![image-20220724150211462](https://raw.githubusercontent.com/wk-Nemo/imgBed/main/imgimage-20220724150211462.png)

因为`obj.foo`进行了两次写操作，所以上述的副作用函数执行了两次，但如果我们并不关心中间的过程，只关心最后的结果，那么第二次打印就是多余的。下面使用调度器来实现此功能。

```js
const jobQueue = new Set()
const p = Promise.resolve()

let isFlushing = false

function flushJob() {
    if(isFlushing) return
    isFlushing = true
    p.then(() => {
        jobQueue.forEach(job => job())
    }).finally (() => {
        isFlushing = false
    })
}

effect(
    () => { console.log(obj.foo) },
    {
        scheduler(fn) {
            jobQueue.add(fn)
            flushJob()
        }
    }
)

obj.foo++
obj.foo++
```

在该调度器下，代码的执行逻辑如下：

- 执行同步任务`effect`函数，输出了`foo`的值1，触发了`track`，将副作用函数和该属性进行依赖绑定
- 执行同步任务`obj.foo++`，触发`trigger`，检查存在调度器，执行调度器`scheduler`
- 将副作用函数加入`jobQueue`，设置`isFlushing`为`true`，将`jobQueue`的执行加入微任务队列
- 再次执行同步任务`obj.foo++`，触发`trigger`，检查存在调度器，执行调度器`scheduler`
- 将副作用函数再次加入`jobQueue`，再次执行`flushJob`
  - 因为`jobQueue`是`set`结构，和前一次添加的副作用函数一样，故不执行添加动作。
  - 因为`isFlushing`为`true`，直接`return`
- 执行微任务` jobQueue.forEach(job => job())`，输出`foo`的值3

![image-20220724152505285](https://raw.githubusercontent.com/wk-Nemo/imgBed/main/imgimage-20220724152505285.png)



## 1 计算属性computed

计算属性用于描述和依赖响应式数据的逻辑，它具有**缓存**的特点，即依赖的响应式数据没有变化的话，无论如何访问该计算属性都不会重新计算。实现如下：

```js
function computed(getter) {
    let value
    let dirty = true

    const effectFn = effect(getter, {
        lazy: true,
        // 如果触发track，就会执行调度，设置dirty为true，重新执行
        // 如股不触发track，不会执行调度，dirty保持false，取值缓存
        scheduler() {
            dirty = true
        }
    })

    const obj = {
        get value() {
            if(dirty) {
                value = effectFn()
                dirty = false
            }
            return value
        }
    }

    return obj
}

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
```

computed属性通过设置lazy属性实现懒加载，只有当真正的访问该计算属性，才会执行副作用函数。

computed方法内置了dirty字段用于判断是否需要重新执行副作用函数：

- 首次调用computed时，lazy为true，因此会执行副作用函数getter，设置dirty为false并将值存储在value中返回；
- 若副作用函数getter依赖的响应式数据没有变化，则不会触发scheduler，dirty依然为false，故访问computed不会执行副作用函数getter，直接返回缓存的值value；
- 若副作用函数getter依赖的响应式数据发生变化，则会触发scheduler，dirty变为true，访问computed重新执行副作用函数getter，并返回执行执行副作用函数getter后的value；

看一个例子：

```js
const sumRes = computed(() => {
    const value = obj.foo + obj.bar
    console.log('computed run!')
    return value
})

console.log(sumRes.value)
console.log(sumRes.value)
console.log(sumRes.value)

obj.foo++
console.log(sumRes.value)
```

结果如下，符合预期。

![image-20220818230818531](https://raw.githubusercontent.com/wk-Nemo/imgBed/main/imgimage-20220818230818531.png)

但是现在的计算属性还不完善，当我们在另一个effect中读取computed属性时：

```js
const sumRes = computed(() => {
    const value = obj.foo + obj.bar
    return value
})

effect(() => {
    console.log(sumRes.value)
})

obj.foo++
```

当obj.foo修改时，我们期望副作用函数会重新执行，就如同我们在vue中使用计算属性时，希望计算属性变化时会重新渲染模板一样，但是上述代码并没有重新执行effect函数。因为计算属性是懒加载的，必须访问才能触发，对于计算属性的getter副作用函数而言，它内部访问的像原始数据只会把getter副作用函数收集为依赖，不会收集调用computed的副作用函数effect。修改起来也很简单，需要我们手动调用track进行跟踪；当计算属性依赖的响应式数据发生变化时，手动调用trigger触发响应：

```js
function computed(getter) {
    let value
    let dirty = true

    const effectFn = effect(getter, {
        lazy: true,
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
```

![image-20220819002031612](https://raw.githubusercontent.com/wk-Nemo/imgBed/main/imgimage-20220819002031612.png)

## 2 侦听器watched

在vue中，侦听器watched应该包含如下功能：监听数据变化（存储旧值的能力），并执行回调函数

| 划分层次       | 功能                                                         |
| -------------- | ------------------------------------------------------------ |
| 监听数据       | 1）监听响应式数据 <br />2）监听getter函数                    |
| 从监听层次     | 1）浅监听：某个值的变化<br />2）深监听：对象的每个属性       |
| 第一次是否执行 | 1）回调懒执行：默认 <br />2）立即回调：immediate为true       |
| 回调执行时机   | 1）组件更新之前调用：默认，flush为pre<br />2）同步执行：flush为sync<br />3）组件更新后调用：flush为post |

### 基本实现

watch的本质就是观测一个响应式数据，并在数据发生变化时通知执行相应的回调函数。

- 首先判断监听的数据是响应式数据还是getter函数
  - 响应式数据递归读取，建立依赖关系
  - getter函数直接执行
- lazy属性配合schedule使用，在数据变化时，触发回调函数，并且带上新老value

```js
function watch(source, cb) {
    let getter
    if(typeof source === 'function') {
        getter = source
    } else {
        getter = () => traverse(source)
    }

    let newValue, oldValue
    const effectFn = effect(
        () => getter(),
        {
            lazy: true,
            // 数据变化时，触发回调函数
            scheduler() {
                newValue = effectFn()
                cb(newValue, oldValue)
                oldValue = newValue
            }
        }
    )

    oldValue = effectFn()

    // 递归读取，建立依赖关系
    function traverse(value, seen = new Set()) {
        if(typeof value !== 'object' || value ===null || seen.has(value)) return
        seen.add(value)
        for(const k in value) {
            traverse(value[k], seen)
        }

        return value
    }
}
```

### 立即执行 & 回调时机

watch的回调函数一般只会在响应式数据变化时执行，而如果我们希望watch创建时立即执行一次回调函数，可以指定immediate为true。

- 这里将执行回调的逻辑抽离出来，可以在不同的地方使用
- immediate则立即执行一次回调，否则值设置oldValue
- flush选项决定回调触发时的执行时机
  - flush为pre，在组件更新之前调用，涉及组件更新时机，暂时无法模拟
  - flush不存在时相当于sync，即同步执行
  - flush为post，将回调放入微任务队列，实现异步延迟执行

```js
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
    // 提取公共逻辑
    const job = () => {
        newValue = effectFn()
        cb(newValue, oldValue)
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
```

### 竞态问题 & 过期的副作用

竞态问题通常在多进程或多线程中被提及，而在前端开发中，也会遇到类似的场景。

```js
let finalData
watch(obj, async () => {
    const res = await fetch('/path/to/request')
    finalData = res
})
```

上述代码中，通过修改obj的值触发回调，先后发出了两次请求A和B。我们期望的是finalData拿到最新的结果，也就是B返回的数据，但是若B的响应较快，则可能出现A响应数据后到的情况，并且将B返回的值给覆盖掉。

![image-20220820152345561](https://raw.githubusercontent.com/wk-Nemo/imgBed/main/imgimage-20220820152345561.png)

在vue中，watch函数的回调函数接受第三个参数onInvalidate，onInvalidate函数会在当前副作用函数过期时执行。

```js
let finalData
watch(obj, async (newValue, oldValue, onInvalidate) => {
    let expired = false
    onInvalidate(() => {
        expired = true
    })

    const res = await fetch('/path/to/request')

    if(!expired) {
        finalData = res
    }
})
```

onInvalidate实现的原理是什么呢？在watch每次检测到变更后，在副作用函数重新执行前，会调用我们通过onInvalidate函数注册的过期回调。

```js
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
```

有了上述的代码后，我们再看一个示例了解执行的顺序：

```js
obj.foo++
setTimeout(() => {
    obj.foo++
}, 200)
```

- 在我们第一次修改foo时，cleanup为空，不触发过期回调，直接执行watch的回调函数
- 第一次执行watch回调时，设置expiredA为false，注册了过期回调cleanupA
- 第二次修改foo时，过期回调cleanup不为空，因此先执行cleanupA，设置expiredA为true，再执行回调函数
- 第二次执行watch回调时，设置expiredB为false，注册了过期回调cleanupB
- B先响应，因为expiredB为false，设置finalData为B返回的值
- A后响应，因为expiredA为true，不设置finalData的值

![image-20220820154630971](https://raw.githubusercontent.com/wk-Nemo/imgBed/main/imgimage-20220820154630971.png)





















