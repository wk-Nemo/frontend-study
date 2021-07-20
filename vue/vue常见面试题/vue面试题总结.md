春招面试时，因为自己才接触前端不久，vue的使用不是很熟练，因此面试官提及vue的原理时我都会坦白自己没看过。后面在学校和实习期间也接触了大大小小的项目，视野得到了扩展，深知只是会一点皮毛不利于自己的发展。因此抓住秋招前的暑假，弥补这一部分的空白。

## 任务&目的

任务：通过阅读掘金、牛客等网站阅读相关文章和vue官方文档再次阅读，形成自己对vue理解的体系。

1. MVVM
2. vue的数据双向绑定（对象和数据）
3. 观察者模式和发布订阅模式
4. vue是如何检测数组变化
5. vue的单项数据流
7. computed和watch
7. 虚拟DOM
8. v-for中的key的作用
9. nextTick的使用
10. vue的生命周期
11. @hook监听子组件的生命周期
12. Vue 的父组件和子组件生命周期钩子函数执行顺序？
13. keep-alive的使用
14. vue的内部指令
15. class和style的绑定方法
16. data为什么是一个函数
17. Vue之间的通信方式
18. Vuex
19. vue的路由
20. SPA单页面
21. SSR



目的：

- 夯实vue框架的基础
- 深入了解其中的一些概念
- 了解面试的问题，应付面试



## 1. MVVM

### MVC设计模式

MVC 模式代表 Model-View-Controller（模型-视图-控制器） 模式。这种模式用于应用程序的分层开发。

- **Model（模型）** - 是应用程序中用于处理应用程序数据逻辑的部分。通常模型对象负责在数据库中存取数据
- **View（视图）** - 是应用程序中处理数据显示的部分。通常视图是依据模型数据创建的
- **Controller（控制器）** - 控制器作用于模型和视图上。它控制数据流向模型对象，并在数据变化时更新视图。它使视图与模型分离开。

![image](https://user-images.githubusercontent.com/62100025/126342984-587539b1-321c-45b2-b54c-f9b10c6c6086.png)


### MVVM

`MVVM`(Model-View-ViewModel)，就是把`MVC`中的`Controller`演变成`ViewModel`。

- Model层 - 指数据模型，泛指后端进行的各种业务逻辑处理和数据操控，对于前端来说就是后端提供的 api 接口。
- View层 - 视图层，也就是用户界面。前端主要由 HTML 和 CSS 来构建 。
- ViewModel层 - 该层做到了数据的双向绑定，前端开发不再需要频繁的操作dom。
  - 模型转换成视图，将后端传送到前端的数据经过处理渲染成所看到的页面。
  - 视图转换成模型，将前端所看到的页面中的信息转换成数据发送给后端。



### MVVM和MVC的区别

MVVM 与 MVC 最大的区别就是：它实现了 View 和 Model 的自动同步，也就是当 Model 的属性改变时，我们不用再自己手动操作 Dom 元素，来改变 View 的显示，而是改变属性后该属性对应 View 层显示会自动改变（对应Vue数据驱动的思想）



### vue没有严格的遵守MVVM的设计思想

![image](https://user-images.githubusercontent.com/62100025/126343190-82491788-9c67-4672-a3c6-14cbe1a66c8b.png)


原因：严格的 MVVM 要求 View 不能和 Model 直接通信（MVC亦是如此），而 Vue 提供了$refs 这个属性，让 Model 可以直接操作 View，违反了这一规定，所以说 Vue 没有完全遵循 MVVM。



## 2. Vue的数据双向绑定

Vue 数据双向绑定主要是指：数据变化更新视图，视图变化更新数据

![1.png](https://user-gold-cdn.xitu.io/2019/8/19/16ca75871f2e5f80?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

简单说明：Vue在初始化数据时，会使用`Object.defineProperty`重新定义data中的所有属性，当页面使用对应属性时，首先会进行依赖收集(收集当前组件的`watcher`)如果属性发生变化会通知相关依赖进行更新操作(`发布订阅`)。

### view变化更新Data

通过事件监听的方式实现



### Data变化更新View

通过数据劫持+发布-订阅模式实现

- 实现一个监听器 Observer：
  - 主要是指让数据对象变得“可观测”，即每次数据读或写时，我们能感知到数据被读取了或数据被改写了。
  - 对数据对象进行遍历，包括子属性对象的属性，利用 Object.defineProperty() 对属性都加上 setter 和 getter。这样的话，给这个对象的某个值赋值，就会触发 setter，那么就能监听到了数据变化。
- 实现一个解析器 Compile：
  - 解析 Vue 模板指令，将模板中的变量都替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，调用更新函数进行数据更新。
- 实现一个订阅者 Watcher：
  - Watcher 订阅者是 Observer 和 Compile 之间通信的桥梁 ，主要的任务是订阅 Observer 中的属性值变化的消息，当收到属性值变化的消息时，触发解析器 Compile 中对应的更新函数。
- 实现一个订阅器 Dep：
  - 完成了数据的'可观测'，即我们知道了数据在什么时候被读或写了，那么，我们就可以在数据被读或写的时候通知那些依赖该数据的视图更新了，为了方便，我们需要先将所有依赖收集起来，一旦数据发生变化，就统一通知更新。其实，这就是“发布订阅者”模式，数据变化为“发布者”，依赖对象为“订阅者”。
  - 订阅器采用 发布-订阅 设计模式，用来收集订阅者 Watcher，对监听器 Observer 和 订阅者 Watcher 进行统一管理。

![1.png](https://user-gold-cdn.xitu.io/2019/8/19/16ca75871f729d89?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### 总结

在vue中数据双向绑定有两层含义，一是视图变化通知数据改变，二是数据变化通知视图更新。前者实现比较简答，可以通过事件绑定的方式实现。后者是重点，简单的概括就是采用了数据劫持 + 发布订阅模式实现。

详细的实现过程则是实现了四个重要的部分：observer、dep、watcher和compile。observer就是使用了Object.defineProperty设置对象的getter和setter，达到了监听数据的目的。除了监听数据，observer还需要将数据添加到dep订阅器内部，dep用来收集所有的订阅者也就是watcher，当数据发生变化后，依次通知订阅者执行更新的函数。wather初始化的时候需要将自己添加到订阅器中，我们前面提到了get，因此我们可以在watcher初始化时调用getter就可以达到添加到订阅器的目的。至此上面的三个部分已经可以实现一个数据的双向绑定了，但是在此还需要一个compile解析 Vue 模板指令，将模板中的变量都替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，调用更新函数进行数据更新。



## 3. 发布订阅模式 vs 观察者模式

![image](https://user-images.githubusercontent.com/62100025/126343265-f3c08d4e-541c-4f8b-9a59-14f9de580b80.png)

从图中可以看出，观察者模式中观察者和目标直接进行交互，而发布订阅模式中统一由调度中心进行处理，订阅者和发布者互不干扰。这样一方面实现了解耦，还有就是可以实现更细粒度的一些控制。比如发布者发布了很多消息，但是不想所有的订阅者都接收到，就可以在调度中心做一些处理，类似于权限控制之类的。还可以做一些节流操作。



## 4. vue如何检测数组的变化

数组考虑性能原因没有用 defineProperty 对数组的每一项进行拦截，而是选择对 7 种数(push,shift,pop,splice,unshift,sort,reverse)方法进行重写(AOP 切片思想)

所以在 Vue 中修改数组的索引和长度是无法监控到的。需要通过以上 7 种变异方法修改数组才会触发数组对应的 watcher 进行更新



## 5. vue的单项数据流

数据总是从父组件传到子组件，子组件没有权利修改父组件传过来的数据，只能请求父组件对原始数据进行修改。这样会防止从子组件意外改变父级组件的状态，从而导致你的应用的数据流向难以理解。

- 在子组件直接用 v-model 绑定父组件传过来的 prop 这样是不规范的写法 开发环境会报警告
- 如果实在要改变父组件的 prop 值 可以再 data 里面定义一个变量 并用 prop 的值初始化它 之后用$emit 通知父组件去修改



## 6. computed和watch

**computed：** 是计算属性，依赖其它属性值，并且 computed 的值有缓存，只有它依赖的属性值发生改变，下一次获取 computed 的值时才会重新计算 computed  的值；

**watch：** 更多的是「观察」的作用，类似于某些数据的监听回调 ，每当监听的数据变化时都会执行回调进行后续操作；

**运用场景：**

- 当我们需要进行数值计算，并且依赖于其它数据时，应该使用 computed，因为可以利用 computed 的缓存特性，避免每次获取值时，都要重新计算；
- 当我们需要在数据变化时执行异步或开销较大的操作时，应该使用 watch，使用 watch 选项允许我们执行异步操作 ( 访问一个 API )，限制我们执行该操作的频率，并在我们得到最终结果前，设置中间状态。这些都是计算属性无法做到的。



## 7. 虚拟DOM

### 真实DOM和解析流程

这部分涉及到了浏览器的相关知识，之前阅读过极客的专栏和三元的博客，是一个比较复杂的过程。在此因为比较正常的DOM的解析流程和虚拟DOM的不同，简单的说一下真实DOM的解析流程。

> 参考三元的[(1.6w字)浏览器灵魂之问，请问你能接得住几个？](https://juejin.cn/post/6844904021308735502#heading-24)



**`JS` 操作真实 `DOM` 的代价？**

 用我们传统的开发模式，原生 `JS` 或 `JQ` 操作 `DOM` 时，浏览器会从构建 DOM 树开始从头到尾执行一遍流程。在一次操作中，我需要更新 10 个 `DOM` 节点，浏览器收到第一个 `DOM` 请求后并不知道还有 9 次更新操作，因此会马上执行流程，最终执行10 次。例如，第一次计算完，紧接着下一个 `DOM` 更新请求，这个节点的坐标值就变了，前一次计算为无用功。计算 `DOM` 节点坐标值等都是白白浪费的性能。即使计算机硬件一直在迭代更新，操作 `DOM` 的代价仍旧是昂贵的，频繁操作还是会出现页面卡顿，影响用户体验



### 虚拟DOM的优缺点

**优点**

- **保证性能下限：** 框架的虚拟 DOM 需要适配任何上层 API 可能产生的操作，它的一些 DOM 操作的实现必须是普适的，所以它的性能并不是最优的；但是比起粗暴的 DOM 操作性能要好很多，因此框架的虚拟 DOM 至少可以保证在你不需要手动优化的情况下，依然可以提供还不错的性能，即保证性能的下限；
- **无需手动操作 DOM：** 我们不再需要手动去操作 DOM，只需要写好 View-Model 的代码逻辑，框架会根据虚拟 DOM 和 数据双向绑定，帮我们以可预期的方式更新视图，极大提高我们的开发效率；
- **跨平台：** 虚拟 DOM 本质上是 JavaScript 对象,而 DOM 与平台强相关，相比之下虚拟 DOM 可以进行更方便地跨平台操作，例如服务器渲染、weex 开发等等。



**缺点**

- **无法进行极致优化：** 虽然虚拟 DOM + 合理的优化，足以应对绝大部分应用的性能需求，但在一些性能要求极高的应用中虚拟 DOM 无法进行针对性的极致优化。
- **首次渲染慢：**首次渲染大量 DOM 时，由于多了一层虚拟 DOM 的计算，会比 innerHTML 插入慢



### 虚拟DOM的原理

虚拟 DOM 的实现原理主要包括以下 3 部分：

- 用 JavaScript 对象模拟真实 DOM 树，对真实 DOM 进行抽象；

  - 用js对象表示真实DOM

    ```javascript
    var el = require("./element.js");
    var ul = el('div',{id:'virtual-dom'},[
      el('p',{},['Virtual DOM']),
      el('ul', { id: 'list' }, [
    	el('li', { class: 'item' }, ['Item 1']),
    	el('li', { class: 'item' }, ['Item 2']),
    	el('li', { class: 'item' }, ['Item 3'])
      ]),
      el('div',{},['Hello World'])
    ]) 
    ```

  - render方法将虚拟DOM渲染成真实的DOM

- diff 算法 —  `diff` 算法用来比较两棵 `Virtual DOM` 树的差异，如果需要两棵树的完全比较，那么 `diff` 算法的时间复杂度为`O(n^3)`。但是在前端当中，你很少会跨越层级地移动 `DOM` 元素，所以 `Virtual DOM` 只会对同一个层级的元素进行对比，如下图所示， `div` 只会和同一层级的 `div` 对比，第二层级的只会跟第二层级对比，这样算法复杂度就可以达到 `O(n)`。

  ![img](https://user-gold-cdn.xitu.io/2019/7/23/16c1e26a5ecf086e?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

  - 对新旧两棵树进行一个深度优先的遍历，这样每个节点都会有一个唯一的标记。

  - 在深度优先遍历的时候，每遍历到一个节点就把该节点和新的的树进行对比。如果有差异的话就记录到一个对象里面。差异类型如下：

    - 节点替换：节点改变了，例如将上面的 `div` 换成 `h1`;
    - 顺序互换：移动、删除、新增子节点，例如上面 `div` 的子节点，把 `p` 和 `ul` 顺序互换；
    - 属性更改：修改了节点的属性，例如把上面 `li` 的 `class` 样式类删除；
    - 文本改变：改变文本节点的文本内容，例如将上面 `p` 节点的文本内容更改为 “`Real Dom`”；

    

- pach 算法 — 将两个虚拟 DOM 对象的差异应用到真正的 DOM 树。

  -  因为步骤一所构建的 `JavaScript` 对象树和 `render` 出来真正的 `DOM` 树的信息、结构是一样的。所以我们可以对那棵 `DOM` 树也进行深度优先的遍历，遍历的时候从步骤二生成的 `patches` 对象中找出当前遍历的节点差异，
  - 我们根据不同类型的差异对当前节点进行不同的 `DOM` 操作 ，例如如果进行了节点替换，就进行节点替换 `DOM` 操作；如果节点文本发生了改变，则进行文本替换的 `DOM` 操作；以及子节点重排、属性改变等 `DOM` 操作



## 8. vue中的key的作用

所以 Vue 中 key 的作用是：key 是为 Vue 中 vnode 的唯一标记，通过这个 key，我们的 diff 操作可以更准确、更快速

**更准确**：因为带 key 就不是就地复用了，在 sameNode 函数 `a.key === b.key` 对比中可以避免就地复用的情况。所以会更加准确。

**更快速**：利用 key 的唯一性生成 map 对象来获取对应节点，比遍历方式更快。



## 9. 全局API nextTick 的使用

nextTick 中的回调是在下次 DOM 更新循环结束之后执行的延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。主要思路就是采用微任务优先的方式调用异步方法去执行 nextTick 包装的方法

```javascript
// 修改数据
vm.msg = 'Hello'
// DOM 还没有更新
Vue.nextTick(function () {
  // DOM 更新了
})

// 作为一个 Promise 使用 (2.1.0 起新增，详见接下来的提示)
Vue.nextTick()
  .then(function () {
    // DOM 更新了
  })
```



## 10. vue的生命周期

### 什么是生命周期？

Vue 实例有一个完整的生命周期，也就是从开始创建、初始化数据、编译模版、挂载 Dom -> 渲染、更新 -> 渲染、卸载等一系列过程，我们称这是 Vue 的生命周期。



### 各个生命周期的作用

| 生命周期      | 描述                                                         |
| ------------- | ------------------------------------------------------------ |
| beforeCreate  | 组件实例被创建之初，组件的属性生效之前                       |
| created       | 组件实例已经完全创建，属性也绑定，但真实 dom 还没有生成，$el 还不可用 |
| beforeMount   | 在挂载开始之前被调用：相关的 render 函数首次被调用           |
| mounted       | el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用该钩子    |
| beforeUpdate  | 组件数据更新之前调用，发生在虚拟 DOM 打补丁之前              |
| update        | 组件数据更新之后                                             |
| activited     | keep-alive 专属，组件被激活时调用                            |
| deactivated   | keep-alive 专属，组件被销毁时调用                            |
| beforeDestory | 组件销毁前调用                                               |
| destoryed     | 组件销毁后调用                                               |



### 生命周期示意图

![1.png](https://user-gold-cdn.xitu.io/2019/8/19/16ca74f183827f46?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



### 在哪个生命周期内调用异步请求？

可以在钩子函数 created、beforeMount、mounted 中进行调用，因为在这三个钩子函数中，data 已经创建，可以将服务端端返回的数据进行赋值。但是本人推荐在 created 钩子函数中调用异步请求，因为在 created 钩子函数中调用异步请求有以下优点：

- 能更快获取到服务端数据，减少页面 loading 时间；
- ssr 不支持 beforeMount 、mounted 钩子函数，所以放在 created 中有助于一致性；




### 在什么阶段可以访问DOM？

根据生命周期示意图，可以在mounted中访问操作DOM



## 11. @hook监听子组件的生命周期

比如有父组件 Parent 和子组件 Child，如果父组件监听到子组件挂载 mounted 就做一些逻辑处理，可以通过以下写法实现：

```javascript
// Parent.vue
<Child @mounted="doSomething"/>
    
// Child.vue
mounted() {
  this.$emit("mounted");
}
复制代码
```

以上需要手动通过 $emit 触发父组件的事件，更简单的方式可以在父组件引用子组件时通过 @hook 来监听即可，如下所示：

```javascript
//  Parent.vue
<Child @hook:mounted="doSomething" ></Child>

doSomething() {
   console.log('父组件监听到 mounted 钩子函数 ...');
},
    
//  Child.vue
mounted(){
   console.log('子组件触发 mounted 钩子函数 ...');
},    
    
// 以上输出顺序为：
// 子组件触发 mounted 钩子函数 ...
// 父组件监听到 mounted 钩子函数 ...     
复制代码
```

当然 @hook 方法不仅仅是可以监听 mounted，其它的生命周期事件，例如：created，updated 等都可以监听。



## 12. Vue 的父组件和子组件生命周期钩子函数执行顺序？

Vue 的父组件和子组件生命周期钩子函数执行顺序可以归类为以下 4 部分：

- 加载渲染过程

  父 beforeCreate -> 父 created -> 父 beforeMount -> 子 beforeCreate -> 子 created -> 子 beforeMount -> 子 mounted -> 父 mounted

- 子组件更新过程

  父 beforeUpdate -> 子 beforeUpdate -> 子 updated -> 父 updated

- 父组件更新过程

  父 beforeUpdate -> 父 updated

- 销毁过程

  父 beforeDestroy -> 子 beforeDestroy -> 子 destroyed -> 父 destroyed



## 13. keep-alive的使用

`keep-alive`可以实现组件缓存，当组件切换时不会对当前组件进行卸载。

常用的两个属性`include/exclude`，允许组件有条件的进行缓存。

两个生命周期`activated/deactivated`，用来得知当前组件是否处于活跃状态。

keep-alive的中还运用了`LRU(Least Recently Used)`算法。



## 14. vue内部指令

![内置指令.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0b46ec8b051246858211c4c7ec129fb3~tplv-k3u1fbpfcp-watermark.image)

### v-if和v-show的区别？

**v-if** 是**真正**的条件渲染，因为它会确保在切换过程中条件块内的事件监听器和子组件适当地被销毁和重建；也是**惰性的**：如果在初始渲染时条件为假，则什么也不做——直到条件第一次变为真时，才会开始渲染条件块。

**v-show** 就简单得多——不管初始条件是什么，元素总是会被渲染，并且只是简单地基于 CSS 的 “display” 属性进行切换。

所以，v-if 适用于在运行时很少改变条件，不需要频繁切换条件的场景；v-show 则适用于需要非常频繁切换条件的场景。



### v-model的原理

我们在 vue 项目中主要使用 v-model 指令在表单 input、textarea、select 等元素上创建双向数据绑定，我们知道 v-model 本质上不过是语法糖，v-model 在内部为不同的输入元素使用不同的属性并抛出不同的事件：

- text 和 textarea 元素使用 value 属性和 input 事件；
- checkbox 和 radio 使用 checked 属性和 change 事件；
- select 字段将 value 作为 prop 并将 change 作为事件。

以 input  表单元素为例：

```javascript
<input v-model='something'>
相当于
<input v-bind:value="something" v-on:input="something = $event.target.value">
```

如果在自定义组件中，v-model 默认会利用名为 value 的 prop 和名为 input 的事件，如下所示：

```javascript
// 父组件：
<ModelChild v-model="message"></ModelChild>

// 子组件：
<div>{{value}}</div>

props:{
    value: String
},
methods: {
  test1(){
     this.$emit('input', '小红')
  },
}
```



## 15. class和style的绑定方法

### Class 行动态绑定

- 对象语法：

  ```javascript
  <div v-bind:class="{ active: isActive, 'text-danger': hasError }"></div>
  
  data: {
    isActive: true,
    hasError: false
  }
  ```

  

- 绑定数据对象或者计算属性

  ```javascript
  // 绑定数据对象
  <div :class="classObject"></div>
  
  data: {
    classObject: {
      active: true,
    }
  }
    
  // 绑定计算属性
  <div :class="classObject"></div>
  
  export default {
    data() {
      return {
      isActive: true,
      };
    },
    computed: {
    classObject: function () {
      return {
        active: this.isActive,
      }
    }
  }
  ```

  

- 数组语法：

  ```javascript
  <div v-bind:class="[isActive ? activeClass : '', errorClass]"></div>
  
  data: {
    activeClass: 'active',
    errorClass: 'text-danger'
  }
  ```

  

### Style动态绑定：

- 对象语法：

  ```javascript
  <div v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
  
  data: {
    activeColor: 'red',
    fontSize: 30
  }
  ```

  

- 数组语法：

  ```javascript
  <div v-bind:style="[styleColor, styleSize]"></div>
  
  data: {
    styleColor: {
       color: 'red'
     },
    styleSize:{
       fontSize:'23px'
    }
  }
  ```



### scoped

加scoped后的编译

![scoped (2).png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6d11a02a213541ba9f4b09f48243bac1~tplv-k3u1fbpfcp-watermark.image)

可以看到，所有样式尾部都加上了`[data-v-xxxx] `，相应的vue文件中<template>内所有标签都加上相同的[data-v-xxxx]，而子组件`div.si-select-content`却不会加上[data-v-xxxx]属性

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8dc66176b221422eae564975c2d1a065~tplv-k3u1fbpfcp-watermark.image)

这样，所有样式目标都指向了当前页面（组件），就实现了完全的样式封闭



## 16. data为什么是一个函数？

因为组件是用来复用的，且 JS 里对象是引用关系，如果组件中 data 是一个对象，那么这样作用域没有隔离，子组件中的 data 属性值会相互影响，如果组件中 data 选项是一个函数，那么每个实例可以维护一份被返回对象的独立的拷贝，组件实例之间的 data 属性值不会互相影响；而 new Vue 的实例，是不会被复用的，因此不存在引用对象的问题。

## 17. Vue之间的通信方式

Vue 组件间通信只要指以下 3 类通信：父子组件通信、隔代组件通信、兄弟组件通信，下面我们分别介绍每种通信方式且会说明此种方法可适用于哪类组件间通信。

**（1）`props / $emit`  适用 父子组件通信**

这种方法是 Vue 组件的基础，相信大部分同学耳闻能详，所以此处就不举例展开介绍。

**（2）`ref` 与 `$parent / $children` 适用 父子组件通信**

- `ref`：如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素；如果用在子组件上，引用就指向组件实例
- `$parent` / `$children`：访问父 / 子实例

**（3）`EventBus （$emit / $on）`  适用于 父子、隔代、兄弟组件通信**

这种方法通过一个空的 Vue 实例作为中央事件总线（事件中心），用它来触发事件和监听事件，从而实现任何组件间的通信，包括父子、隔代、兄弟组件。

**（4）`$attrs`/`$listeners` 适用于 隔代组件通信**

- `$attrs`：包含了父作用域中不被 prop 所识别 (且获取) 的特性绑定 ( class 和 style 除外 )。当一个组件没有声明任何 prop 时，这里会包含所有父作用域的绑定 ( class 和 style 除外 )，并且可以通过 `v-bind="$attrs"` 传入内部组件。通常配合 inheritAttrs 选项一起使用。
- `$listeners`：包含了父作用域中的 (不含 .native 修饰器的)  v-on 事件监听器。它可以通过 `v-on="$listeners"` 传入内部组件

**（5）`provide / inject` 适用于 隔代组件通信**

祖先组件中通过 provider 来提供变量，然后在子孙组件中通过 inject 来注入变量。 provide / inject API 主要解决了跨级组件间的通信问题，不过它的使用场景，主要是子组件获取上级组件的状态，跨级组件间建立了一种主动提供与依赖注入的关系。

**（6）Vuex  适用于 父子、隔代、兄弟组件通信**

Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。每一个 Vuex 应用的核心就是 store（仓库）。“store” 基本上就是一个容器，它包含着你的应用中大部分的状态 ( state )。

- Vuex 的状态存储是响应式的。当 Vue 组件从 store 中读取状态的时候，若 store 中的状态发生变化，那么相应的组件也会相应地得到高效更新。
- 改变 store 中的状态的唯一途径就是显式地提交  (commit) mutation。这样使得我们可以方便地跟踪每一个状态的变化。



## 18. Vuex

Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。每一个 Vuex 应用的核心就是 store（仓库）。“store” 基本上就是一个容器，它包含着你的应用中大部分的状态 ( state )。

（1）Vuex 的状态存储是响应式的。当 Vue 组件从 store 中读取状态的时候，若 store 中的状态发生变化，那么相应的组件也会相应地得到高效更新。

（2）改变 store 中的状态的唯一途径就是显式地提交 (commit) mutation。这样使得我们可以方便地跟踪每一个状态的变化。

主要包括以下几个模块：

- State：定义了应用状态的数据结构，可以在这里设置默认的初始状态。
- Getter：允许组件从 Store 中获取数据，mapGetters 辅助函数仅仅是将 store 中的 getter 映射到局部计算属性。
- Mutation：是唯一更改 store 中状态的方法，且必须是同步函数。
- Action：用于提交 mutation，而不是直接变更状态，可以包含任意异步操作。
- Module：允许将单一的 Store 拆分为多个 store 且同时保存在单一的状态树中。



## 19. vue的路由

### vue-router 路由模式有几种？

vue-router 有 3 种路由模式：hash、history、abstract，对应的源码如下所示：

```javascript
switch (mode) {
  case 'history':
        this.history = new HTML5History(this, options.base)
        break
  case 'hash':
        this.history = new HashHistory(this, options.base, this.fallback)
        break
  case 'abstract':
        this.history = new AbstractHistory(this, options.base)
        break
  default:
        if (process.env.NODE_ENV !== 'production') {
          assert(false, `invalid mode: ${mode}`)
        }
}
复制代码
```

其中，3 种路由模式的说明如下：

- hash:  使用 URL hash 值来作路由。支持所有浏览器，包括不支持 HTML5 History Api 的浏览器；
- history :  依赖 HTML5 History API 和服务器配置。具体可以查看 HTML5 History 模式；
- abstract :  支持所有 JavaScript 运行环境，如 Node.js 服务器端。如果发现没有浏览器的 API，路由会自动强制进入这个模式.



### 能说下 vue-router 中常用的 hash 和 history 路由模式实现原理吗？

**（1）hash 模式的实现原理**

早期的前端路由的实现就是基于 location.hash 来实现的。其实现原理很简单，location.hash 的值就是 URL 中 # 后面的内容。比如下面这个网站，它的 location.hash 的值为 '#search'：

```
https://www.word.com#search
```

hash  路由模式的实现主要是基于下面几个特性：

- URL 中 hash 值只是客户端的一种状态，也就是说当向服务器端发出请求时，hash 部分不会被发送；
- hash 值的改变，都会在浏览器的访问历史中增加一个记录。因此我们能通过浏览器的回退、前进按钮控制hash 的切换；
- 可以通过 a 标签，并设置 href 属性，当用户点击这个标签后，URL 的 hash 值会发生改变；或者使用  JavaScript 来对 loaction.hash 进行赋值，改变 URL 的 hash 值；
- 我们可以使用 hashchange 事件来监听 hash 值的变化，从而对页面进行跳转（渲染）。

**（2）history 模式的实现原理**

HTML5 提供了 History API 来实现 URL 的变化。其中做最主要的 API 有以下两个：history.pushState() 和 history.repalceState()。这两个 API 可以在不进行刷新的情况下，操作浏览器的历史纪录。唯一不同的是，前者是新增一个历史记录，后者是直接替换当前的历史记录，如下所示：

```
window.history.pushState(null, null, path);
window.history.replaceState(null, null, path);
```

history 路由模式的实现主要基于存在下面几个特性：

- pushState 和 repalceState 两个 API 来操作实现 URL 的变化 ；
- 我们可以使用 popstate  事件来监听 url 的变化，从而对页面进行跳转（渲染）；
- history.pushState() 或 history.replaceState() 不会触发 popstate 事件，这时我们需要手动触发页面跳转（渲染）。



## 20. SPA单页面

SPA（ single-page application ）仅在 Web 页面初始化时加载相应的 HTML、JavaScript 和 CSS。一旦页面加载完成，SPA 不会因为用户的操作而进行页面的重新加载或跳转；取而代之的是利用路由机制实现 HTML 内容的变换，UI 与用户的交互，避免页面的重新加载。

**优点：**

- 用户体验好、快，内容的改变不需要重新加载整个页面，避免了不必要的跳转和重复渲染；
- 基于上面一点，SPA 相对对服务器压力小；
- 前后端职责分离，架构清晰，前端进行交互逻辑，后端负责数据处理；

**缺点：**

- 初次加载耗时多：为实现单页 Web 应用功能及显示效果，需要在加载页面的时候将 JavaScript、CSS 统一加载，部分页面按需加载；
- 前进后退路由管理：由于单页应用在一个页面中显示所有的内容，所以不能使用浏览器的前进后退功能，所有的页面切换需要自己建立堆栈管理；
- SEO 难度较大：由于所有的内容都在一个页面中动态替换显示，所以在 SEO 上其有着天然的弱势。



## 21. SSR

> Vue.js 是构建客户端应用程序的框架。默认情况下，可以在浏览器中输出 Vue 组件，进行生成 DOM 和操作 DOM。然而，也可以将同一个组件渲染为服务端的 HTML 字符串，将它们直接发送到浏览器，最后将这些静态标记"激活"为客户端上完全可交互的应用程序。
>
> 即：SSR大致的意思就是vue在客户端将标签渲染成的整个 html 片段的工作在服务端完成，服务端形成的html 片段直接返回给客户端这个过程就叫做服务端渲染。

**服务端渲染 SSR 的优缺点如下：**

**（1）服务端渲染的优点：**

- 更好的 SEO： 因为 SPA 页面的内容是通过 Ajax 获取，而搜索引擎爬取工具并不会等待 Ajax 异步完成后再抓取页面内容，所以在 SPA 中是抓取不到页面通过 Ajax 获取到的内容；而 SSR 是直接由服务端返回已经渲染好的页面（数据已经包含在页面中），所以搜索引擎爬取工具可以抓取渲染好的页面；
- 更快的内容到达时间（首屏加载更快）： SPA 会等待所有 Vue 编译后的 js 文件都下载完成后，才开始进行页面的渲染，文件下载等需要一定的时间等，所以首屏渲染需要一定的时间；SSR 直接由服务端渲染好页面直接返回显示，无需等待下载 js 文件及再去渲染等，所以 SSR 有更快的内容到达时间；

**（2) 服务端渲染的缺点：**

- 更多的开发条件限制： 例如服务端渲染只支持 beforCreate 和 created 两个钩子函数，这会导致一些外部扩展库需要特殊处理，才能在服务端渲染应用程序中运行；并且与可以部署在任何静态文件服务器上的完全静态单页面应用程序 SPA 不同，服务端渲染应用程序，需要处于 Node.js server 运行环境；
- 更多的服务器负载：在 Node.js  中渲染完整的应用程序，显然会比仅仅提供静态文件的  server 更加大量占用CPU 资源 (CPU-intensive - CPU 密集)，因此如果你预料在高流量环境 ( high traffic ) 下使用，请准备相应的服务器负载，并明智地采用缓存策略。
