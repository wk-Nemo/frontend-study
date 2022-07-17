## 0 响应式数据和副作用函数

在了解响应式系统之前，先了解什么是**副作用函数**和**响应式数据**。

副作用函数：`effect`函数的执行会直接或者间接的影响其他函数的执行

```js
function effect1() {
    document.body.innerText = 'hello vue3'
}

let val = 1
function effect2() {
    val = 2
}
```

响应式数据：当`obj.text`的值变化后，副作用函数能够重新执行，也就是重新设置`body`的`innerText`属性。

```js
const obj = { text: 'hello world' }
function effect() {
    document.body.innerText = obj.text
}
// 执行此代码时，effect函数重新执行
opj.text = 'hello wk'
```



实现一个简单的响应式系统：

- 当`effect`执行时，触发`obj.text`的**读操作**，将`effect`函数存储到`bucket`数据结构中。
- 当`obj.text`被修改时，触发`obj.text`的**写操作**，从`bucket`中拿出`effect`函数并执行。

在vue2中，是通过`Object.defineProperty`函数实现的，在vue3中，使用了ES5+的代理对象`Proxy`实现。下面使用`Proxy`实现一个简单的响应式系统：

```js
// 存储副作用函数的数据结构，目前使用的是Set
const bucket = new Set()

const data = {
    text: 'hello world'
}

// 使用Proxy对data进行代理
const obj = new Proxy(data, {
    // 拦截读的操作
    get(target, key) {
        // 将副作用函数添加到bucket中
        bucket.add(effect)
        return target[key]
    },
    // 拦截写的操作
    set(target, key, newVal) {
        // 设置属性
        target[key] = newVal
        // 从bucket中取出副作用函数并执行
        bucket.forEach(fn => fn())
        return true
    }
})

// 副作用函数
function effect() {
    // 读取了obj.text
    console.log(obj.text)
}

effect()

setTimeout(() => {
    console.log('After 2s....')
    obj.text = 'hello wk'
}, 2000)
```

这里定义了一个`data`对象，随后使用了`Proxy`对其进行了代理。在这个简单的响应式系统中，`Proxy`代理做了两件事：1）拦截读取操作，当副作用函数`effect`读取`obj.text`属性时，将副作用函数`effect`添加到`bucket`。2）拦截写操作，当重写`obj.text`属性时，从`bucket`中取出`effect`并执行。

运行上述代码：

![image-20220716203916335](https://raw.githubusercontent.com/wk-Nemo/imgBed/main/imgimage-20220716203916335.png)

了解了实现响应式系统最基本的原理后，我们在这个基础上一步一步的完善，让该响应式看起来“牛逼”一些。

## 1 告别硬编码

上述代码中，硬编码了副作用函数`effect`，而在实际的使用场景中，副作用可以是各种各样的名字，甚至是一个匿名函数，因此本节实现**注册副作用函数的机制**。

- 提供注册副作用函数的入口
- 建立副作用函数与被操作目标字段之间的依赖关系

提供注册副作用函数的入口：其实就是提供一个函数，可以将副作用函数作为参数传递给它。

```js
const bucket = new Set()
// 全局变量，存储被注册的副作用函数
let activeEffect

// 注册副作用函数的入口
function effect(fn) {
    // 当调用effect注册副作用函数时，将副作用函数fn赋值给activeEffect
    activeEffect = fn
    fn()
}

const data = {
    text: 'hello world'
}

const obj = new Proxy(data, {
    get(target, key) {
        if(activeEffect) {
            bucket.add(activeEffect)
        }
        return target[key]
    },
    set(target, key, newVal) {
        target[key] = newVal
        bucket.forEach(fn => fn())
        return true
    }
})
```

测试上述代码

```js
// test
effect(
    () => {
        console.log(obj.text)
    }
)

setTimeout(() => {
    console.log('After 2s....')
    obj.text = 'hello wk'
}, 2000)

setTimeout(() => {
    console.log('After 3s....')
    obj.noExit = 'hello wk'
}, 3000)
```

![image-20220716211208058](https://raw.githubusercontent.com/wk-Nemo/imgBed/main/imgimage-20220716211208321.png)

第一次的输出在预期之内，当`obj.text`属性被修改时，能够执行在`effect`中注册的匿名函数。但第二次的输出与预期不符合，因为在第二个`setTimeout`中没有修改`obj.text`属性，而是为`obj`提供一个新的属性`noExit`。按照正常的逻辑思维，该**匿名函数**在注册时`Proxy`拦截的`key`值为`text`，也就是该**匿名函数**是作为`obj.text`属性的**副作用函数**绑定在一起，所以我们不希望在`Proxy`拦截**其它属性的写操作**（`noExit`）时会触发该副作用函数。

解决这个问题很简单，在注册阶段建立起**对象属性**和**副作用函数**对应的关系即可。

```js
// 替换set的数据结构，使用WeakMap
const bucket = new WeakMap()
let activeEffect

function effect(fn) {
    activeEffect = fn
    fn()
}

const data = {
    text: 'hello world'
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

// 将拦截读取的操作提取出来
// 作用：将副作用函数activeEffect函数添加到bucket中
function track(target, key) {
    if(!activeEffect) return
    // 取出对象（target）的Map
    let depsMap = bucket.get(target)
    // 如果不存在，那么新建立一个Map，并建立与target的联系
    if(!depsMap) {
        bucket.set(target, (depsMap = new Map()))
    }
    // 取出属性（key）的set
    let deps = depsMap.get(key)
    // 如果不存在，建立一个新的set，并建立与key的关系
    if(!deps) {
        depsMap.set(key, (deps = new Set()))
    }
    // 将当前全局变量中的副作用函数添加到“对象-属性-set”层面的依赖中
    deps.add(activeEffect)
}

// 将拦截写的操作提取出来
// 作用：从bucket中取出副作用函数并执行
function trigger(target, key) {
    // 取出对象（target）层级的依赖关系
    const depsMap = bucket.get(target)
    if(!depsMap) return
    // 取出属性（key）层级的依赖关系
    const effects = depsMap.get(key)
    // 执行副作用函数
    effects && effects.forEach(fn => fn())
}
```

这里做了两点变动：

1）逻辑上的变动

首先是逻辑上的变动，在`bucket`的数据结构上，使用了`WeakMap`代替了`set`结构。`Map`数据结构比`Set`数据结构能更好的建立起一一对应的依赖关系，这里选用了`WeakMap`而没有`Map`，是因为`WeakMap`对`key`是弱引用，不会影响垃圾回收的工作。简单来说，就是当作为`WeakMap`的`key`键存在的对象一旦没有任何引用了，就会被js引擎自动回收，后面也无法通过该`key`键对应的值。

改变了存储副作用函数的`bucket`的数据结构后，相应的**读拦截操作**逻辑也进行改变，让其从级别1的捕获，细化为级别2的捕获。细化后的**读拦截操作**能够精准的建立起**某个对象的某个属性**和**副作用函数**的依赖关系。在**拦截写操作**时，根据读阶段拦截的层级关系，找出对应属性的所以副作用函数，并依次执行。

```
级别1：bucket（set）- 对象（key）- 副作用函数（value）
级别2：bucket（weakmap）-对象（key）- 属性Map（value） =>  属性Map（map）- 属性（key）- 副作用函数集合set（value）
```

2）代码层面的封装

将`Proxy`中拦截操作的相关逻辑提炼出来，得到了`track`函数和`trigger`函数：`track`函数名有“追踪”的含义，负责将副作用函数`activeEffect`函数添加到`bucket`中；`trigger`意味触发机，在对象属性进行改动时，从`bucket`中取出相应的副作用函数并执行。

## 2 完善依赖关系的建立——分支切换&cleanup

在1中，我们对代码进行了两个方面的改动，其中花费了很大的力气重新建立了副作用函数和对应属性的依赖关系，但还是存在一些问题。看下述测试代码：

```js
const data = {
    ok: true,
    text: 'hello world'
}

effect(
    function effectFn() {
        const out = obj.ok ? obj.text : 'hello wk'
        console.log(out)
    }
)

obj.ok = false
obj.text = 'hello my world'
```

执行结果如下

![image-20220716224627370](https://raw.githubusercontent.com/wk-Nemo/imgBed/main/imgimage-20220716224627370.png)

`obj.ok`值设置为`false`时，副作用函数触发了两次，这不是期望得到的结果。因为`obj.ok`值设置为`false`时，副作用函数`effectFn`不会读取`obj.text`，所以应该删除`obj.text`属性与副作用函数`effectFn`之间的依赖关系。

- 给副作用函数新增`deps`数组，存储所有与副作用函数建立依赖关系的对象属性的`set`
- `deps`的收集放在`track`中
- `trigger`函数需要重新建立`effectsToRun`，避免无线循环执行。
  - 如果不修改，副作用函数每次会调用`cleanup`清除`deps`中的相关依赖
  - 执行`fn`时，又会将依赖添加入`deps`中
  - 循环上面两个步骤，就会无限执行

```js
function effect(fn) {
    const effectFn = () => {
        cleanup(effectFn)
        activeEffect = effectFn
        fn()
    }
    // 为副作用函数新增依赖收集的入口
    effectFn.deps = []
    effectFn()
}

// 清除所有与副作用函数建立依赖关系的对象属性set中的该副作用函数
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
	// 副作用函数收集依赖的过程
    activeEffect.deps.push(deps)
}

function trigger(target, key) {
    const depsMap = bucket.get(target)
    if(!depsMap) return
    const effects = depsMap.get(key)
	// 避免无线循环
    const effectsToRun = new Set(effects)
    effectsToRun.forEach(effectFn => effectFn())
}
```

## 3 完善依赖关系的建立——effect嵌套

副作用函数可以进行嵌套

```js
const data = {
    foo: true,
    bar: true
}

effect(function effectFn1() {
    console.log('effectFn1执行')
    effect(function effectFn2() {
        console.log('effectFn2执行')
        const b = obj.bar
    })
    const a = obj.foo
})

obj.foo = false
```

在嵌套发生的情况下，期望建立的依赖如下：

- `obj.foo`修改触发`effectFn1`，而`effectFn1`又间接触发`effectFn2`
- `obj.bar`修改触发`effectFn2`

![image-20220717132816916](https://raw.githubusercontent.com/wk-Nemo/imgBed/main/imgimage-20220717132816916.png)

但实际代码的运行结果如上，当`obj.foo`修改时，不但没有触发`effectFn1`反而触发了`effectFn2`。这是因为当`effectFn2`结束运行后，`obj.foo`的读操作拦截`track`在收集依赖的过程中，将全局变量`activeEffect`（此时为`effectFn2`）添加到了对应的属性的副作用函数依赖中。因此，在副作用函数发生嵌套时，**需要一个函数栈`effectStack`，在副作用函数执行时将其压入栈底，待副作用函数执行结束时再将其从栈中弹出，并始终让`activeEffect`指向栈顶的副作用函数**。

```js
let activeEffect
// effect栈 预防副作用函数嵌套
const effectStack = []

function effect(fn) {
    const effectFn = () => {
        cleanup(effectFn)
        activeEffect = effectFn
        // 副作用函数调用之前入栈
        effectStack.push(effectFn)
        fn()
        // 副作用函数调用完出栈
        effectStack.pop()
        // 激活的副作用函数始终指向栈顶
        activeEffect = effectStack[effectStack.length - 1]
    }
    effectFn.deps = []
    effectFn()
}
```

## 4 完善依赖关系的建立——避免无限递归循环

继续完善依赖关系的建立：

```js
data = {
    foo: 0
}

obj = new Proxy(data, {...})
                       
effect(() => {
	obj.foo = obj.foo + 1
})
```

上述的副作用函数会造成无限循环：

- 副作用函数读取`obj.foo`，触发`track`，建立两者的依赖关系
- 副作用函数给`obj.foo`赋值+1后的数字，触发`trigger`，继续执行副作用函数
- 上面两个步骤一直循环下去，会造成栈溢出

可以给`trigger`增加**守卫条件**：如果`trigger`触发的副作用函数与当前激活的副作用函数`activeEffect`相同，则不触发

```js
function trigger(target, key) {
    const depsMap = bucket.get(target)
    if(!depsMap) return
    const effects = depsMap.get(key)

    const effectsToRun = new Set()
    effects && effects.forEach(effectFn => {
        // 避免无限循环
        if(effectFn !== activeEffect) {
            effectsToRun.add(effectFn)
        }
    })
    effectsToRun.forEach(effectFn => effectFn())
}
```
