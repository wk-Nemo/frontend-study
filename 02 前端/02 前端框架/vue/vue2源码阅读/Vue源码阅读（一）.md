## 从一个demo开始

今天开始阅读vue源码，首先写一个简单的demo进行debugger摸清楚整个初始化的流程。

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <script src="./vue.js"></script>
</head>
<body>
  <div id="app">
    {{a}}
  </div>
  <script>
    debugger
    let vm = new Vue({
      el: '#app',
      data() {
        return {
          a: 1
        }
      },
    })
  </script>
</body>
</html>
```

## new Vue

`new Vue`执行的是在`src/core/instance/index.js`中暴露出的`Vue`

```js
import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)

export default Vue
```

接着会执行`this._init(options)`,`_init`是在`scr/core/instance/init.js`

```js
export function initMixin (Vue: Class<Component>) {
  Vue.prototype._init = function (options?: Object) {
    const vm: Component = this
    // a uid
    vm._uid = uid++

    let startTag, endTag
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      startTag = `vue-perf-start:${vm._uid}`
      endTag = `vue-perf-end:${vm._uid}`
      mark(startTag)
    }

    // a flag to avoid this being observed
    vm._isVue = true
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options)
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      initProxy(vm)
    } else {
      vm._renderProxy = vm
    }
    // expose real self
    vm._self = vm
    initLifecycle(vm)
    initEvents(vm)
    initRender(vm)
    callHook(vm, 'beforeCreate')
    initInjections(vm) // resolve injections before data/props
    initState(vm)
    initProvide(vm) // resolve provide after data/props
    callHook(vm, 'created')

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false)
      mark(endTag)
      measure(`vue ${vm._name} init`, startTag, endTag)
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
}
```
这段代码干了几件事情：

- 定义了一个`vm`，初始化的值为我们`new Vue`时传入的参数，并在这个对象加入了几个新的值如:
    - `_uid = 0`
    - `_isVue = true` 
    - `$options = mergeOptions(resolveConstructorOptions(vm.constructor), options || {}, vm)`
    - `vm._self = vm`
- 一系列的初始化
    - `initLifecycle(vm)`
    - `initEvents(vm) `
    - `initRender(vm) `
    - `callHook(vm, 'beforeCreate')` 
    - `initInjections(vm) `
    - `initState(vm)` 
    - `initProvide(vm) `
    - `callHook(vm, 'created')`
- `vm.$mount(vm.$options.el)` 进行挂载

## 给`vm`添加`$option`

本来我没在意`$option`这个参数，但是在后面的阅读中，发现很多参数是在`$option`中取出来的，因此特地花一个小节来看看`mergeOptions`函数做了啥。

`mergeOption`函数定义在`src/core/util/options.js`中
- 还没看详细的代码，从定义的位置可以猜出这个函数是一个工具作用，专门用来**合并选项**。
- 本打算继续深入看函数是如何实现的，会不会新添加了什么选项到`option`，但看到函数的注释后可以清晰的理解它只是合并两个`option`。因此我没必要关系它是如何实现的，而应该关心调用它的地方到底合并了哪两个`option`.

```js
/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
export function mergeOptions (
  parent: Object,
  child: Object,
  vm?: Component
): Object {
  if (process.env.NODE_ENV !== 'production') {
    checkComponents(child)
  }

  if (typeof child === 'function') {
    child = child.options
  }

  normalizeProps(child, vm)
  normalizeInject(child, vm)
  normalizeDirectives(child)

  // Apply extends and mixins on the child options,
  // but only if it is a raw options object that isn't
  // the result of another mergeOptions call.
  // Only merged options has the _base property.
  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm)
    }
    if (child.mixins) {
      for (let i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm)
      }
    }
  }

  const options = {}
  let key
  for (key in parent) {
    mergeField(key)
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key)
    }
  }
  function mergeField (key) {
    const strat = strats[key] || defaultStrat
    options[key] = strat(parent[key], child[key], vm, key)
  }
  return options
}
```

我们回到参数这里，在`_init`中调用`mergeOption`时传入了三个参数：
- `resolveConstructorOptions(vm.constructor)`
- `options || {}`，我们`new Vue`时传入的参数
- `vm`

最后我们可以在控制台打印`vm`看看此时该对象内部有哪些内容

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/facfa86a896043fb91d71b7458402bdf~tplv-k3u1fbpfcp-watermark.image?)

## 一系列的初始化

上面我们弄清楚了在一系列的操作后`vm`里面有了哪些东西，接下来我们就要看看一系列的初始化到底干了啥。

- `initLifecycle(vm)`
- `initEvents(vm) `
- `initRender(vm) `
- `callHook(vm, 'beforeCreate')` 
- `initInjections(vm) `
- `initState(vm)` 
- `initProvide(vm) `
- `callHook(vm, 'created')`

一、`initLifecycle(vm)`给`vm`上添加了很多的`$xxx`

```js
export function initLifecycle (vm: Component) {
  const options = vm.$options

  // locate first non-abstract parent
  let parent = options.parent
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent
    }
    parent.$children.push(vm)
  }

  vm.$parent = parent
  vm.$root = parent ? parent.$root : vm

  vm.$children = []
  vm.$refs = {}

  vm._watcher = null
  vm._inactive = null
  vm._directInactive = false
  vm._isMounted = false
  vm._isDestroyed = false
  vm._isBeingDestroyed = false
}
```

二、`initEvents(vm) `初始化也只给`vm`是添加了`_events`和`_hasHookEvent`

```js
export function initEvents (vm: Component) {
  vm._events = Object.create(null)
  vm._hasHookEvent = false
  // init parent attached events
  const listeners = vm.$options._parentListeners
  if (listeners) {
    updateComponentListeners(vm, listeners)
  }
}
```

三、`initRender(vm) `上半段同上面一样，添加了一些内容在`vm`上

```js
export function initRender (vm: Component) {
  vm._vnode = null // the root of the child tree
  vm._staticTrees = null // v-once cached trees
  const options = vm.$options
  const parentVnode = vm.$vnode = options._parentVnode // the placeholder node in parent tree
  const renderContext = parentVnode && parentVnode.context
  vm.$slots = resolveSlots(options._renderChildren, renderContext)
  vm.$scopedSlots = emptyObject
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  const parentData = parentVnode && parentVnode.data

  /* istanbul ignore else */
  if (process.env.NODE_ENV !== 'production') {
    defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, () => {
      !isUpdatingChildComponent && warn(`$attrs is readonly.`, vm)
    }, true)
    defineReactive(vm, '$listeners', options._parentListeners || emptyObject, () => {
      !isUpdatingChildComponent && warn(`$listeners is readonly.`, vm)
    }, true)
  } else {
    defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, null, true)
    defineReactive(vm, '$listeners', options._parentListeners || emptyObject, null, true)
  }
}
```

注意到后面最后一步时`defineReactive`函数大有乾坤，该函数的位置在`src/core/observer/index.js`。如果你之前了解了vue的数据双向绑定的原理，那么对这段代码你一定不会陌生，他是对对象进行了处理，为数据的双向绑定做了铺垫。

```js
/**
 * Define a reactive property on an Object.
 */
export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  const dep = new Dep()

  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get
  const setter = property && property.set
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }

  let childOb = !shallow && observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) return
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow && observe(newVal)
      dep.notify()
    }
  })
}
```

四、看到这一串代码最瞩目的就是`callHook(vm, 'beforeCreate')`和`callHook(vm, 'created')`，很自然而然的就可以将它和生命周期联想到一起。

```js
export function callHook (vm: Component, hook: string) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget()
  const handlers = vm.$options[hook]
  const info = `${hook} hook`
  if (handlers) {
    for (let i = 0, j = handlers.length; i < j; i++) {
      invokeWithErrorHandling(handlers[i], vm, null, vm, info)
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook)
  }
  popTarget()
}
```

五、`initInjections(vm) `这里初始化的时候都是`undefined`

```js
export function initInjections (vm: Component) {
  const result = resolveInject(vm.$options.inject, vm)
  if (result) {
    toggleObserving(false)
    Object.keys(result).forEach(key => {
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== 'production') {
        defineReactive(vm, key, result[key], () => {
          warn(
            `Avoid mutating an injected value directly since the changes will be ` +
            `overwritten whenever the provided component re-renders. ` +
            `injection being mutated: "${key}"`,
            vm
          )
        })
      } else {
        defineReactive(vm, key, result[key])
      }
    })
    toggleObserving(true)
  }
}
```

六、`initState(vm)` 这段代码比较直接，可以清楚的看到对`props`，`methods`和`data`进行了初始化

```JS
export function initState (vm: Component) {
  vm._watchers = []
  const opts = vm.$options
  if (opts.props) initProps(vm, opts.props)
  if (opts.methods) initMethods(vm, opts.methods)
  if (opts.data) {
    initData(vm)
  } else {
    observe(vm._data = {}, true /* asRootData */)
  }
  if (opts.computed) initComputed(vm, opts.computed)
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch)
  }
}
```

七、`initProvide(vm) `略

## 进行挂载

通过前面的代码阅读可知`_init`在前面对`vm`进行了很多的工作，到了`_init`的最后一步则执行`vm.$mount(vm.$options.el)`将实例挂载到`el`上。

因为 `$mount` 这个方法的实现是和平台、构建方式都相关的，我们重点来了解带 `compiler` 版本的 `$mount` 实现。它


- 将原本`src/platform/web/runtime/index.js`的`$mount`缓存
    ```JS
    Vue.prototype.$mount = function (
      el?: string | Element,
      hydrating?: boolean
    ): Component {
      el = el && inBrowser ? query(el) : undefined
      return mountComponent(this, el, hydrating)
    }
    ```
- 在`src/platform/web/entry-runtime-with-compiler.js` 文件中重新定义`$mount`
    ```js
    var mount = Vue.prototype.$mount;
    Vue.prototype.$mount = function (
      el?: string | Element,
      hydrating?: boolean
    ): Component {
      el = el && query(el)
    
      /* istanbul ignore if */
      if (el === document.body || el === document.documentElement) {
        process.env.NODE_ENV !== 'production' && warn(
          `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
        )
        return this
      }
    
      const options = this.$options
      // resolve template/el and convert to render function
      if (!options.render) {
        let template = options.template
        if (template) {
          if (typeof template === 'string') {
            if (template.charAt(0) === '#') {
              template = idToTemplate(template)
              /* istanbul ignore if */
              if (process.env.NODE_ENV !== 'production' && !template) {
                warn(
                  `Template element not found or is empty: ${options.template}`,
                  this
                )
              }
            }
          } else if (template.nodeType) {
            template = template.innerHTML
          } else {
            if (process.env.NODE_ENV !== 'production') {
              warn('invalid template option:' + template, this)
            }
            return this
          }
        } else if (el) {
          template = getOuterHTML(el)
        }
        if (template) {
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
            mark('compile')
          }
    
          const { render, staticRenderFns } = compileToFunctions(template, {
            outputSourceRange: process.env.NODE_ENV !== 'production',
            shouldDecodeNewlines,
            shouldDecodeNewlinesForHref,
            delimiters: options.delimiters,
            comments: options.comments
          }, this)
          options.render = render
          options.staticRenderFns = staticRenderFns
    
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
            mark('compile end')
            measure(`vue ${this._name} compile`, 'compile', 'compile end')
          }
        }
      }
      return mount.call(this, el, hydrating)
    }
    ```
- 最后再执行原本的`$mount`也就是执行了`mountComponent`方法

我们来看看`mountComponent`方法干了什么

```js
export function mountComponent (
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  vm.$el = el
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode
    if (process.env.NODE_ENV !== 'production') {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        )
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        )
      }
    }
  }
  callHook(vm, 'beforeMount')

  let updateComponent
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    updateComponent = () => {
      const name = vm._name
      const id = vm._uid
      const startTag = `vue-perf-start:${id}`
      const endTag = `vue-perf-end:${id}`

      mark(startTag)
      const vnode = vm._render()
      mark(endTag)
      measure(`vue ${name} render`, startTag, endTag)

      mark(startTag)
      vm._update(vnode, hydrating)
      mark(endTag)
      measure(`vue ${name} patch`, startTag, endTag)
    }
  } else {
    updateComponent = () => {
      vm._update(vm._render(), hydrating)
    }
  }

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, {
    before () {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate')
      }
    }
  }, true /* isRenderWatcher */)
  hydrating = false

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true
    callHook(vm, 'mounted')
  }
  return vm
}
```

- 实例化一个渲染`Watcher`，在它的回调函数中会调用 `updateComponent` 方法
- 在`updateComponent` 方法中调用 `vm._render` 方法先生成虚拟 Node
- 最终调用 `vm._update` 更新 DOM。

## 小结

读完这一段代码能感觉到在这个简单的小demo中，vue的工作始终都围绕着**生命周期**、**数据双向绑定**和**模板编译**这三块内容。后面进一步打算围绕这几个部分的实现阅读源码。