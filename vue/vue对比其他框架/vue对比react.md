## React与Vue的相似处

- 使用 Virtual DOM
- 提供了响应式 (Reactive) 和组件化 (Composable) 的视图组件。
- 将注意力集中保持在核心库，而将其他功能如路由和全局状态管理交给相关的库。



## React与Vue的不同点

### 1. HTML&&CSS

- JSX vs Template
  - 在 React 中，一切都是 JavaScript。不仅仅是 HTML 可以用 JSX 来表达，现在的潮流也越来越多地将 CSS 也纳入到 JavaScript 中来处理。
    - 你可以使用完整的编程语言 JavaScript 功能来构建你的视图页面。比如你可以使用临时变量、JS 自带的流程控制、以及直接引用当前 JS 作用域中的值等等。
    - 开发工具对 JSX 的支持相比于现有可用的其他 Vue 模板还是比较先进的 (比如，linting、类型检查、编辑器的自动完成)。
  - Vue 的整体思想是拥抱经典的 Web 技术，事实上 Vue 也提供了渲染函数，甚至JSX。然而，我们默认推荐的还是模板。任何合乎规范的 HTML 都是合法的 Vue 模板，这也带来了一些特有的优势：
    - 对于很多习惯了 HTML 的开发者来说，模板比起 JSX 读写起来更自然。
    - 基于 HTML 的模板使得将已有的应用逐步迁移到 Vue 更为容易。
    - 你甚至可以使用其他模板预处理器，比如 Pug 来书写 Vue 的模板。
- 组件内的CSS
  - React已经有了CSS in js的方案，比如说（styled-components）
  - vue设置样式的默认放方式是单文件组件里类似 `style` 的标签。
    - 并且可选scoped，选中后会自动添加一个唯一的attribute(比如 `data-v-21e5b78`) 为组件内 CSS 指定作用域，编译的时候 `.list-container:hover` 会被编译成类似 `.list-container[data-v-21e5b78]:hover`。

### 2. 运行时的性能

- 在 React 应用中，当某个组件的状态发生变化时，它会以该组件为根，重新渲染整个组件子树。
  - 如要避免不必要的子组件的重渲染，你需要在所有可能的地方使用 `PureComponent`，或是手动实现 `shouldComponentUpdate` 方法。同时你可能会需要使用不可变的数据结构来使得你的组件更容易被优化。
  - 然而，使用 `PureComponent` 和 `shouldComponentUpdate` 时，需要保证该组件的整个子树的渲染输出都是由该组件的 props 所决定的。如果不符合这个情况，那么此类优化就会导致难以察觉的渲染结果不一致。这使得 React 中的组件优化伴随着相当的心智负担。

- 在 Vue 应用中，组件的依赖是在渲染过程中自动追踪的，所以系统能精确知晓哪个组件确实需要被重渲染。你可以理解为每一个组件都已经自动获得了 `shouldComponentUpdate`，并且没有上述的子树问题限制。
  - Vue 的这个特点使得开发者不再需要考虑此类优化，从而能够更好地专注于应用本身。



### 3. 原生渲染

- React Native 能使你用相同的组件模型编写有本地渲染能力的 APP (iOS 和 Android)。能同时跨多平台开发，对开发者是非常棒的。
- Vue 和 Week进行官方合作，Weex 是阿里巴巴发起的跨平台用户界面开发框架，同时也正在 Apache 基金会进行项目孵化。
  - Weex 允许你使用 Vue 语法开发不仅仅可以运行在浏览器端，还能被用于开发 iOS 和 Android 上的原生应用的组件。