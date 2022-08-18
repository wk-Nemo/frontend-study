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























