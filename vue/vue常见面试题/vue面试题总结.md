春招面试时，因为自己才接触前端不久，vue的使用不是很熟练，因此面试官提及vue的原理时我都会坦白自己没看过。后面在学校和实习期间也接触了大大小小的项目，视野得到了扩展，深知只是会一点皮毛不利于自己的发展。因此抓住秋招前的暑假，弥补这一部分的空白。

## 任务&目的

任务：通过阅读掘金、牛客等网站阅读相关文章和vue官方文档再次阅读，形成自己对vue理解的体系。

1. MVVM
2. vue的数据双向绑定（对象和数据）
3. 观察者模式和发布订阅模式
4. vue是如何检测数组变化
5. vue的单项数据流
6. v-model的原理
7. computed和watch
8. 虚拟DOM和diff算法
9. v-for中的key的作用
10. vue的生命周期
11. 各生命周期适合干些什么
12. @hook监听子组件的生命周期
13. keep-alive的使用
14. Vue之间的通信方式
15. v-if和v-show
16. class的绑定方法
17. data为什么是一个函数
18. vue的路由
19. vuex
20. SPA单页面
21. Vue SSR



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

![image-20210719160426847](/Users/wukui/Documents/study/fall-study-frontend/vue/vue常见面试题/Untitled.assets/image-20210719160426847.png)

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

![image-20210719160820091](/Users/wukui/Documents/study/fall-study-frontend/vue/vue常见面试题/Untitled.assets/image-20210719160820091.png)

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

![image-20210719194255564](/Users/wukui/Documents/study/fall-study-frontend/vue/vue常见面试题/Untitled.assets/image-20210719194255564.png)

从图中可以看出，观察者模式中观察者和目标直接进行交互，而发布订阅模式中统一由调度中心进行处理，订阅者和发布者互不干扰。这样一方面实现了解耦，还有就是可以实现更细粒度的一些控制。比如发布者发布了很多消息，但是不想所有的订阅者都接收到，就可以在调度中心做一些处理，类似于权限控制之类的。还可以做一些节流操作。



## 4. vue如何检测数组的变化

数组考虑性能原因没有用 defineProperty 对数组的每一项进行拦截，而是选择对 7 种数(push,shift,pop,splice,unshift,sort,reverse)方法进行重写(AOP 切片思想)

所以在 Vue 中修改数组的索引和长度是无法监控到的。需要通过以上 7 种变异方法修改数组才会触发数组对应的 watcher 进行更新



## 5. vue的单项数据流

数据总是从父组件传到子组件，子组件没有权利修改父组件传过来的数据，只能请求父组件对原始数据进行修改。这样会防止从子组件意外改变父级组件的状态，从而导致你的应用的数据流向难以理解。

- 在子组件直接用 v-model 绑定父组件传过来的 prop 这样是不规范的写法 开发环境会报警告
- 如果实在要改变父组件的 prop 值 可以再 data 里面定义一个变量 并用 prop 的值初始化它 之后用$emit 通知父组件去修改



## 6. v-model的原理

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



## 7. computed和watch

**computed：** 是计算属性，依赖其它属性值，并且 computed 的值有缓存，只有它依赖的属性值发生改变，下一次获取 computed 的值时才会重新计算 computed  的值；

**watch：** 更多的是「观察」的作用，类似于某些数据的监听回调 ，每当监听的数据变化时都会执行回调进行后续操作；

**运用场景：**

- 当我们需要进行数值计算，并且依赖于其它数据时，应该使用 computed，因为可以利用 computed 的缓存特性，避免每次获取值时，都要重新计算；
- 当我们需要在数据变化时执行异步或开销较大的操作时，应该使用 watch，使用 watch 选项允许我们执行异步操作 ( 访问一个 API )，限制我们执行该操作的频率，并在我们得到最终结果前，设置中间状态。这些都是计算属性无法做到的。

