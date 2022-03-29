# Vue3响应式学习

## 1 JavaScript对象及Proxy的工作原理

### 1.1 内部方法

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

### 1.2 常规对象和异质对象

js中的对象分为**常规对象**和**异质对象**。

**什么是常规对象呢？**

满足以下条件的是常规对象

- 必要的内部方法，必须使用ECMA规范10.1.x节给出的定义实现
- 内部方法`[[Call]]`，必须使用ECMA规范10.2.1节给出的定义实现
- 内部方法`[[Construct]]`，必须使用ECMA规范10.2.2节给出的定义实现

**什么是异质对象？**

任何不属于常规对象的对象都是异质对象。

### 1.3 Proxy

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

## 2 代理Object

先着手拦截对 Object 的读取操作

- `obj.foo`：访问属性
- `key in obj`：判断对象和原型上是否存在 key
- `for(const key in obj){}`：循环遍历对象

Object 响应的时机

## 3 代理数组
