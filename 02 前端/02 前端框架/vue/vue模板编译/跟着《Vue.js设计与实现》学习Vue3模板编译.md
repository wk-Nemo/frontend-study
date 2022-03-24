---
title: 跟着《Vue.js设计与实现》学习Vue3模板编译
categories: Vue
imgSrc: https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1a5b8f5465bb45fb86ebdbdaf2423e01~tplv-k3u1fbpfcp-watermark.image?
introduce: Vue 的模版和 JSX 都属于特定领域的特定语言，它们的实现难度属于中低级别，只要掌握几本的编译技术理论即可以实现这些功能。
---

![CD2FBF3CCBF00D968BB051266B38C06C.jpg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1a5b8f5465bb45fb86ebdbdaf2423e01~tplv-k3u1fbpfcp-watermark.image?)

## 0 写在前面

前段时间加入的前端讨论群和关注的一些公众号被《Vue.js设计与实现》刷屏，抱着好奇的心态买了一本回来学习。之前学习 Vue2 时就对模板编译这一块不是很理解，于是乎书到手就开始跟着书去学这一部分，并总结了这篇博客。有很多地方写的不是很详细，只是方便大家了解整体的流程，详细内容还是强烈推荐大家去看原著。

## 1 虚拟DOM

Vue为我们提供了**模版语法**，我们可以通过编写如下的代码获取我们想要的 dom 结构

```html
<template>
  <h1 @click="handler"></h1>
</template>
```

这并不是真实的 HTML 语句，因为模板语法里面我们可以使用 `v-if`、`v-for`、`v-on`等指令，模板里的语法最终会被转换成虚拟 DOM 描述的 UI。如果你比较熟悉虚拟 DOM，你可以不使用模板，直接写**渲染（render）函数**。

```js
import {h} from 'vue'

export default {
  render() {
    return h('h1', { onClick: handler })
  }
}
```

这里的 **h 函数**是为了帮助我们编写虚拟 DOM 更加的轻松，其最终返回的内容如下：

```js
export default {
  render() {
    return {
      tag: 'h1',
      props: { onClick: handler }
    }
  }
}
```

一个组件要渲染的内容是通过**渲染函数**来描述的，也就是上述代码的 **render 函数**。Vue 会根据组件的 render 函数返回值拿到虚拟 DOM ，然后再经过**渲染器**的渲染，就可以把**虚拟 DOM** 渲染成**真实的 DOM**。

## 2 模板编译

上面我们讲了模板语法最终会被转换成渲染函数，渲染函数最终会返回成虚拟 DOM，以便后面的流程正常的进行。而模板语法转换成渲染函数便是**编译器**做的工作，对于如下的模板：

```html
<div @click="handler">
  click me
</div>
```

经过编译器的工作最终会转换成如下的渲染函数：

```js
render() {
  return h('div', { onClick: handler }, 'click me')
}
```

以我们熟悉的 .vue 文件为例，一个 .vue 文件就是一个组件

```vue
<template>
  <div @click="handler">
    click me
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 数据...
    }
  }，
  methods: {
    handler: function() {
      // 函数体...
    }
  }
}
</script>
```

`<template>` 标签里的内容就是模板内容，编译器会把模板内容编译成渲染函数并添加到 `<script>` 标签块的组件对象上，最终代码如下：

```js
export default {
  data() {
    return {
      // 数据...
    }
  }，
  methods: {
    handler: function() {
      // 函数体...
    }
  },
  render() {
    return h('div', { onClick: handler }, 'click me')
  }
}
```

## 3  传统编译器

编译器其实只是一段程序，它用于将 A 语言翻译成 B 语言。

- A 语言：源代码
- B 语言： 目标代码
- 源代码 -> 目标代码：编译

完整的编译一般包含以下几个步骤

- 词法分析
- 语法分析
- 语义分析
- 中间代码生成
- 优化
- 目标代码生成

## 4 Vue编译器概览

Vue 的模板作为 DSL（涉及一种领域特定的语言），其编译流程会有所不同。对 Vue 来说，源代码就是组件模板，目标代码就是能在浏览器上运行的 js 代码，或者其他拥有 js 运行时的平台代码

```html
<!-- 源代码 -->
<div>
  <h1 :id="dynamicId">
    Vue Template
  </h1>
</div>
```

```javascript
// 目标代码
function render() {
  return h('div', [
    h('h1', {id: dynamic}, 'Vue Template')
  ])
}
```

Vue 的模板编译器首先对模板进行**词法分析**和**语法分析**，得到**模板 AST**。接着，将**模板 AST** 转换成 **JavaScriptAST**。最后，根据 **JavaScriptAST** 生成 **JavaScript 代码**（即渲染函数代码），具体流程如下：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/44e9c0f5e84244ed848ba1a79fea17ae~tplv-k3u1fbpfcp-watermark.image?)

总的来说Vue编译的核心**主要是三个阶段**：parse、transform、generate。Vue 核心 compiler 的代码只是简单的调用了这三个函数：

```javascript
function compiler(template) {
  const ast = parse(template)
  transform(ast)
  const code = generate(ast.jsNode)
  
  return code
}
```

**第一步 parse：** 这里将**模板**转换成**模板AST**

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0415701b0ea848318924490a81dce9cc~tplv-k3u1fbpfcp-watermark.image?)

```javascript
// tokens
[
  { type: 'tag', name: 'div' },
  { type: 'tag', name: 'p' },
  { type: 'text', context: 'Vue' },
  { type: 'tagEnd', name: 'p' },
  { type: 'tag', name: 'p' },
  { type: 'text', context: 'Template' },
  { type: 'tagEnd', name: 'p' },
  { type: 'tagEnd', name: 'div' }
]
```

```javascript
// 模版AST
{
  type: 'Root',
  childrent: [
    {
      type: 'Element',
      tag: 'div',
      children: [
        {
          type: 'Element',
          tag: 'p'
          children: [{ type: 'Text', content: 'Vue' }]
        },
        {
          type: 'Element',
          tag: 'p'
          children: [{ type: 'Text', content: 'Template' }]
        },
      ]
    }
  ]
}
```

**第二步 transform：** 这里为第一步生成的**模板AST**中树的每一个节点添加一个 **jsNode**，也就是 **JavaScriptAST**

这里我们为什么不直接将模板AST转换成目标代码呢？

因为我们需要将模板AST编译成渲染函数，而渲染函数是由 JavaScript 代码来描述的，因此，我们需要将**模板AST**转换成用于**描述渲染函数的AST**，即 **JavaScriptAST**。下面举个例子更清楚的去了解这句话的意思：

`<div><p>Vue</p><p>Template</p></div>`模板最终返回的渲染函数如下：

```javascript
render() {
  return h('div', [
    h('p', 'Vue'),
    h('p', 'Template')
  ])
}
```

而 transform 要做的工作就是将第一步中的模板AST转换成如下用于描述渲染函数的数据结构

```js
const FunctionDeclNode = {
    type: 'FunctionDecl', // 节点类型
    // 函数名称
    id: { type: 'Identifier', name: 'render'},
    // 函数参数
    params: [],
    // 函数体
    body: [
        {
            type: 'ReturnStatement',
            return: {
                type: 'CallExpression',
                callee: { type: 'Indentifier', name: 'h' },
                arguments: [
                    { type: 'StringLiteral', value: 'div' },
                    {
                        type: 'ArrayExpression',
                        elements: [
                            {
                                type: 'CallExpression',
                                callee: { type: 'Indentifier', name: 'h' },
                                arguments: [
                                    { type: 'StringLiteral', value: 'p' },
                                    { type: 'StringLiteral', value: 'Vue'}
                                ]
                            },
                            {
                                type: 'CallExpression',
                                callee: { type: 'Indentifier', name: 'h' },
                                arguments: [
                                    { type: 'StringLiteral', value: 'p' },
                                    { type: 'StringLiteral', value: 'Template' }
                                ]
                            }
                        ]
                    }
                ]
            }
        }
    ]
}
```

**第三步 generate：** 在第二步中我们获取了描述渲染函数的 ast，这一步中我们根据该 ast 进行字符串的拼接得倒渲染函数据即可。

```javascript
render() {
  return h('div', [
    h('p', 'Vue'),
    h('p', 'Template')
  ])
}
```

## 5 parse详解

上面我们了解了 parse 的主要的工作是读取 Vue 的模板代码，然后将他们解析成一个一个 Token，最后再根据这些 Token 生成模板AST。

首先了解解析成 Token 的规则，这里用到了**有限状态机**。学过编译的同学肯定对这个词不陌生，简单介绍一下，解析器在解析模板时会遇到 n 种的状态，每个状态下遇到不同情况要跳转到哪一种情况。

```js
// 状态机状态
const State = {
    initial: 1,      // 初始状态
    tagOpen: 2,      // 标签开始状态
    tagName: 3,      // 标签名称状态
    text: 4,         // 文本状态
    tagEnd: 5,       // 结束标签状态
    tagEndName: 6    // 结束标签名称状态
}

// 判断是否是字母
function isAlpha(char) {
    return char >= 'a' && char <= 'z' || char >= 'A' && char<= 'Z'
}

function tokenSize(str) {
    //一开始是初始状态
    let currentState = State.initial
    const chars = []
    const tokens = []
    // 状态机不断循环，当全部解析完毕后循环停止
    while(str) {
        const char = str[0]
        switch(currentState) {
            // 初始状态
            case State.initial:
                if(char === '<') {
                    // 遇到 < 进入标签开始状态
                    currentState = State.tagOpen
                    str = str.slice(1)
                } else if(isAlpha(char)) {
                    // 遇到字母进入文本状态
                    currentState = State.text
                    chars.push(char)
                    str = str.slice(1)
                }
                break
            // 标签开始状态
            case State.tagOpen:
                if(isAlpha(char)) {
                    // 遇到字母进入标签名称状态
                    currentState = State.tagName
                    chars.push(char)
                    str = str.slice(1)
                } else if (char === '/') {
                    // 遇到 / 进入结束标签状态
                    currentState = State.tagEnd
                    str = str.slice(1)
                }
                break
            // 标签名称状态
            case State.tagName:
                if(isAlpha(char)) {
                    // 遇到字母，任然处于标签名称状态
                    chars.push(char)
                    str = str.slice(1)
                } else if (char === '>') {
                    // 遇到 > 进入初始状态
                    currentState = State.initial
                    // 解析成功一个 tag
                    tokens.push({
                        type: 'tag',
                        name: chars.join('')
                    })
                    chars.length = 0
                    str = str.slice(1)
                }
                break
            // 文本状态
            case State.text:
                if (isAlpha(char)) {
                    // 遇到字母任然保持文本状态
                    chars.push(char)
                    str = str.slice(1)
                } else if (char === '<') {
                    // 遇到 < 进入标签开始状态
                    currentState = State.tagOpen
                    // 解析成功一个 text
                    tokens.push({
                        type: 'text',
                        content: chars.join('')
                    })
                    chars.length = 0
                    str = str.slice(1)
                }
                break
            // 结束标签状态
            case State.tagEnd:
                if(isAlpha(char)) {
                    // 遇到字母进入结束标签名称状态
                    currentState = State.tagEndName
                    chars.push(char)
                    str = str.slice(1)
                }
                break
            // 结束标签名称状态
            case State.tagEndName:
                if(isAlpha(char)) {
                    // 遇到字母保持结束标签名称状态
                    chars.push(char)
                    str = str.slice(1)
                } else if(char === '>') {
                    // 遇到 > 进入初始状态
                    currentState = State.initial
                    // 成功解析 tagEnd
                    tokens.push({
                        type: 'tagEnd',
                        name: chars.join('')
                    })
                    chars.length = 0
                    str = str.slice(1)
                }
                break
        }
    }

    return tokens
}

const template = '<div><p>Vue</p><p>Template</p></div>'
const tokens = tokenSize(template)
console.log(tokens)
```

执行上述代码，最后 `<div><p>Vue</p><p>Template</p></div>` 被解析成 tokens，如下：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3bc2521530e3439c9f535656b99efc2d~tplv-k3u1fbpfcp-watermark.image?)

拿到上面的 tokens 后，我们要将其转换成模板AST。思路比较简单，用一个栈进行存储，首先推入根结点 root，接着遍历一遍 tokens，根据不同的情况进行进栈和出栈的操作即可。

```js
const { tokenSize } = require('./token')

function parse(str) {
    // 获取 tokens
    const tokens = tokenSize(str)
    // 根结点
    const root = {
        type: 'Root',
        children: []
    }
    // 栈
    const elementStack = [root]

    while(tokens.length) {
        const parent = elementStack[elementStack.length - 1]
        const t = tokens[0]
        switch(t.type) {
            case 'tag':
                const elementNode = {
                    type: 'Element',
                    tag: t.name,
                    children: []
                }
                // 添加到父节点的children属性中
                parent.children.push(elementNode)
                // 加入栈顶
                elementStack.push(elementNode)
                break
            case 'text':
                const textNode = {
                    type: 'Text',
                    content: t.content
                }
                // 添加到父节点的children属性中
                parent.children.push(textNode)
                break
            case 'tagEnd':
                // 弹出栈顶
                elementStack.pop()
                break
        }

        tokens.shift()
    }

    return root
}
```

执行上面的代码，最后 `<div><p>Vue</p><p>Template</p></div>` 被解析成模板AST如下：

```js
  type: 'Root',
  childrent: [
    {
      type: 'Element',
      tag: 'div',
      children: [
        {
          type: 'Element',
          tag: 'p'
          children: [{ type: 'Text', content: 'Vue' }]
        },
        {
          type: 'Element',
          tag: 'p'
          children: [{ type: 'Text', content: 'Template' }]
        },
      ]
    }
  ]
}
```

## 6 transform 详解

上面我们提到了，为了生成最终的 render 函数，我们只拿到**模板AST**还不够，需要将用于**描述模板的AST转换成用于描述JavaScript的AST**。

我们最终要转换的目标如下：

```javascript
render() {
  return h('div', [
    h('p', 'Vue'),
    h('p', 'Template')
  ])
}
```

上述代码用如下 AST 来描述：

```js
const FunctionDeclNode = {
    type: 'FunctionDecl', // 节点类型
    // 函数名称
    id: { type: 'Identifier', name: 'render'},
    // 函数参数
    params: [],
    // 函数体
    body: [
        {
            type: 'ReturnStatement',
            return: {
                type: 'CallExpression',
                callee: { type: 'Indentifier', name: 'h' },
                arguments: [
                    { type: 'StringLiteral', value: 'div' },
                    {
                        type: 'ArrayExpression',
                        elements: [
                            {
                                type: 'CallExpression',
                                callee: { type: 'Indentifier', name: 'h' },
                                arguments: [
                                    { type: 'StringLiteral', value: 'p' },
                                    { type: 'StringLiteral', value: 'Vue'}
                                ]
                            },
                            {
                                type: 'CallExpression',
                                callee: { type: 'Indentifier', name: 'h' },
                                arguments: [
                                    { type: 'StringLiteral', value: 'p' },
                                    { type: 'StringLiteral', value: 'Template' }
                                ]
                            }
                        ]
                    }
                ]
            }
        }
    ]
}
```

所以现在的思路就是将第五步中拿到的AST转换成上述的AST。先定义一些辅助函数为实现这一步骤做一些铺垫。

```js
// 创建 StringLiteral 类型节点
function createStringLiteral(value) {
    return {
        type: 'StringLiteral',
        value
    }
}

// 创建 Identifier 类型节点
function createIdentifier(name) {
    return {
        type: 'Identifier',
        name
    }
}

// 创建 ArrayExpression 类型节点
function createArrayExpression(elements) {
    return {
        type: 'ArrayExpression',
        elements
    }
}

// 创建 CallExpression 类型节点
function createCallExpression(callee, arguments) {
    return {
        type: 'CallExpression',
        callee: createIdentifier(callee),
        arguments
    }
}

// 将模板AST中Text类型节点转换成JSAST中StringLiteral类型节点
function transformText(node) {
    if(node.type !== 'Text') {
        return
    }

    node.jsNode = createStringLiteral(node.content)
}

// 将模板AST中Element类型节点转换成JSAST中类型节点CallExpression类型节点
function transformElement(node) {
    return () => {
        if(node.type !== 'Element') {
            return
        }

        const callExp = createCallExpression('h', [
            createStringLiteral(node.tag)
        ])
        node.children.length === 1
            ? callExp.arguments.push(node.children[0].jsNode)
            : callExp.arguments.push(
                createArrayExpression(node.children.map(c => c.jsNode))
            )
        node.jsNode = callExp
    }
}

// 将模板AST中Element类型节点转换成JSAST中类型节点FunctionDecl类型节点
function transformRoot(node) {
    return () => {
        if(node.type !== 'Root') {
            return
        }
        const vnodeJSAST = node.children[0].jsNode
        node.jsNode = {
            type: 'FunctionDecl',
            id: { type: 'Identifier', name: 'render' },
            params: [],
            body: [
                {
                    type: 'ReturnStatement',
                    return: vnodeJSAST
                }
            ]
        }
    }
}
```

我们考虑如下两点：

**问题一：** AST是树形结构，所以想要将一种AST转换成另一种AST我们需要进行树的深度遍历，如何在遍历的过程中对其中的节点进行修改、删除和替换等操作？

我们可以定义一个 context 上下文，用于存储当前的节点，父节点，以及需要操作的函数。在遍历的开始让节点执行每一个函数。

**问题二：** 在转换AST的过程中，往往需要根据子节点的情况来判断对当前节点进行替换，这就要求父节点转换操作必须等待所有子节点转换完毕以后再执行。这点如何去做？

在上述遍历过程中，定义一个数组用于存储函数，在遍历的最后再去执行这些函数

解决了上面两个问题我们上代码，我们在深度遍历的过程中，使用上面定义的辅助函数，实现了AST的转换，得到了本小结开始处所想要的 `FunctionDeclNode`。

```js
function transform(ast) {
    dump(ast)
    const context = {
        currentNode: null,
        childIndex: 0,
        parent: null,
        nodeTransforms: [
            transformRoot,
            transformElement,
            transformText
        ]
    }
    traverseNode(ast, context)
    dump(ast)
}

// 深度遍历模板AST
function traverseNode(ast, context) {
    // 定义初始节点
    context.currentNode = ast
    // 存储函数的数组
    const exitFns = []
    // 上下文中的函数
    const transforms = context.nodeTransforms
    // 依次将函数存入exitFns中
    for(let i = 0; i < transforms.length; i++) {
        const onExit = transforms[i](context.currentNode, context)
        if(onExit) {
            exitFns.push(onExit)
        }
        if(!context.currentNode) return
    }
    // 判断是否有子节点
    const children = context.currentNode.children
    if(children) {
        // 深度遍历
        for(let i = 0; i < children.length; i++) {
            context.parent = context.currentNode
            context.childIndex = i
            traverseNode(children[i], context)
        }
    }

    // 执行函数
    let i = exitFns.length
    while(i--) {
        exitFns[i]()
    }
}
```

## 7 generate 详解

有了 JavaScriptAST，接下来就是**字符串拼接的艺术**了。我们需要根据 JavaScriptAST 来生成最终的 render 函数，Vue 会根据组件的 render 函数返回值拿到虚拟 DOM ，然后再经过渲染器的渲染，就可以把虚拟 DOM 渲染成真实的 DOM。

```js
function compile(template) {
    // 生成模板AST
    const ast = parse(template)
    // 转换成JavaScriptAST
    transform(ast)
    // 生成渲染函数
    const code = generate(ast.jsNode)
    return code
}
```

当然这是后话了，在模板编译的模块中，我们只需要关注**如何根据 JavaScriptAST 拼接成最后的 render 函数。**

因为要生成函数的描述，我们先定义一些要用到的辅助函数在一个上下文环境 context 中，context 中的 code 就是我们最终需要的 render 函数。

```js
function generate(node) {
    const context = {
        code: '',
        push(code) {
            context.code += code
        },
        currentIndent: 0,
        newline() {
            context.code += '\n' + `  `.repeat(context.currentIndent)
        },
        indent() {
            context.currentIndent++
            context.newline()
        },
        deIndent() {
            context.currentIndent--
            context.newline()
        }
    }

    genNode(node, context)

    return context.code
}
```

genNode 的逻辑很简单，根据节点的不同类型执行不同的函数，这里的 node 就是转换而来的 JavaScriptAST。

```js
function genNode(node, context) {
    switch(node.type) {
        case 'FunctionDecl':
            genFunctionDecl(node, context)
            break
        case 'ReturnStatement':
            genReturnStatement(node, context)
            break
        case 'CallExpression':
            genCallExpression(node, context)
            break
        case 'StringLiteral':
            genStringLiteral(node, context)
            break
        case 'ArrayExpression':
            genArrayExpression(node, context)
            break
    }
}
```

节点类型为 FunctionDecl，需要生成 `function(...) { ... }`。

- 参数部分需要调用 genNode，最终走到 ArrayExpression 类型的判断。这里我们参数为空，因此不执行。
- 函数体内容需要调用 genNode 将 FunctionDecl 内部的 body 数组中的对象依次执行一遍。这里我们的对象只有一个 ReturnStatement 类型的节点，看下一步

```js
function genFunctionDecl(node, context) {
    const { push, indent, deIndent } = context
    push(`function ${node.id.name}`)
    push(`(`)
    // 为函数的参数生成代码
    genNodeList(node.params, context)
    push(`) `)
    push('{')
    indent()
    node.body.forEach(n => genNode(n, context))
    deIndent()
    push(`}`)
}
```

节点类型为 ReturnStatement，生成 `return ...`

- return 后面的内容调用 genNode 生成。这里我们 node.return 的类型是 CallExpression

```js
function genReturnStatement(node, context) {
    const { push } = context
    push(`return `)
    genNode(node.return, context)
}
```

节点类型为 CallExpression，生成`funName(...)`，我们的 funName 为 h，因此最终生成的就是`h(...)`，函数调用的参数再次通过调用 genNode 生成。

```js
function genCallExpression(node, context) {
    const { push } = context
    const { callee, arguments: args } = node
    push(`${callee.name}(`)
    genNodeList(args, context)
    push(`)`) 
}
```

节点类型为 StringLiteral，将对应的 value 值加到 code 上即可

```js
function genStringLiteral(node, context) {
    const { push } = context
    push(`${node.value}`)
}
```
