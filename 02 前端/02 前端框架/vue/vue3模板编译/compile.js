const State = {
    initial: 1,      // 初始状态
    tagOpen: 2,      // 标签开始状态
    tagName: 3,      // 标签名称状态
    text: 4,         // 文本状态
    tagEnd: 5,       // 结束标签状态
    tagEndName: 6    // 结束标签名称状态
}

function isAlpha(char) {
    return char >= 'a' && char <= 'z' || char >= 'A' && char<= 'Z'
}

function tokenSize(str) {
    let currentState = State.initial
    const chars = []
    const tokens = []
    while(str) {
        const char = str[0]
        switch(currentState) {
            case State.initial:
                if(char === '<') {
                    currentState = State.tagOpen
                    str = str.slice(1)
                } else if(isAlpha(char)) {
                    currentState = State.text
                    chars.push(char)
                    str = str.slice(1)
                }
                break
            case State.tagOpen:
                if(isAlpha(char)) {
                    currentState = State.tagName
                    chars.push(char)
                    str = str.slice(1)
                } else if (char === '/') {
                    currentState = State.tagEnd
                    str = str.slice(1)
                }
                break
            case State.tagName:
                if(isAlpha(char)) {
                    chars.push(char)
                    str = str.slice(1)
                } else if (char === '>') {
                    currentState = State.initial
                    tokens.push({
                        type: 'tag',
                        name: chars.join('')
                    })
                    chars.length = 0
                    str = str.slice(1)
                }
                break
            case State.text:
                if (isAlpha(char)) {
                    chars.push(char)
                    str = str.slice(1)
                } else if (char === '<') {
                    currentState = State.tagOpen
                    tokens.push({
                        type: 'text',
                        content: chars.join('')
                    })
                    chars.length = 0
                    str = str.slice(1)
                }
                break
            case State.tagEnd:
                if(isAlpha(char)) {
                    currentState = State.tagEndName
                    chars.push(char)
                    str = str.slice(1)
                }
                break
            case State.tagEndName:
                if(isAlpha(char)) {
                    chars.push(char)
                    str = str.slice(1)
                } else if(char === '>') {
                    currentState = State.initial
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

function parse(str) {
    const tokens = tokenSize(str)
    const root = {
        type: 'Root',
        children: []
    }
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
                parent.children.push(elementNode)
                elementStack.push(elementNode)
                break
            case 'text':
                const textNode = {
                    type: 'Text',
                    content: t.content
                }
                parent.children.push(textNode)
                break
            case 'tagEnd':
                elementStack.pop()
                break
        }

        tokens.shift()
    }

    return root
}

// 打印当前AST信息
function dump(node, indent = 0) {
    const type = node.type
    const desc = node.type === 'Root'
        ? ''
        : node.type === 'Element'
            ? node.tag
            : node.content
    console.log(`${'-'.repeat(indent)}${type}: ${desc}`)

    if(node.children) {
        node.children.forEach(n => dump(n, indent + 2))
    }
}


function createStringLiteral(value) {
    return {
        type: 'StringLiteral',
        value
    }
}

function createIdentifier(name) {
    return {
        type: 'Identifier',
        name
    }
}

function createArrayExpression(elements) {
    return {
        type: 'ArrayExpression',
        elements
    }
}

function createCallExpression(callee, arguments) {
    return {
        type: 'CallExpression',
        callee: createIdentifier(callee),
        arguments
    }
}

function transformText(node) {
    if(node.type !== 'Text') {
        return
    }

    node.jsNode = createStringLiteral(node.content)
}

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

function traverseNode(ast, context) {
    context.currentNode = ast
    const exitFns = []
    const transforms = context.nodeTransforms
    for(let i = 0; i < transforms.length; i++) {
        const onExit = transforms[i](context.currentNode, context)
        if(onExit) {
            exitFns.push(onExit)
        }
        if(!context.currentNode) return
    }

    const children = context.currentNode.children
    if(children) {
        for(let i = 0; i < children.length; i++) {
            context.parent = context.currentNode
            context.childIndex = i
            traverseNode(children[i], context)
        }
    }

    let i = exitFns.length
    while(i--) {
        exitFns[i]()
    }
}


function transform(ast) {
    dump(ast)
    const context = {
        currentNode: null,
        childIndex: 0,
        parent: null,
        replaceNode(node) {
            context.parent.children[context.childIndex] = node
            this.currentNode = node
        },
        removeNode() {
            context.parent.children.splice(context.childIndex, 1)
            context.currentNode = null
        },
        nodeTransforms: [
            transformRoot,
            transformElement,
            transformText
        ]
    }
    traverseNode(ast, context)
    dump(ast)
}

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

function genArrayExpression(node, context) {
    const { push } = context
    push('[')
    genNodeList(node.elements, context)
    push(']')
}

function genNodeList(nodes, context) {
    const { push } = context
    for(let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        genNode(node, context)
        if(i < nodes.length - 1) {
            push(', ')
        }
    }
}

function genReturnStatement(node, context) {
    const { push } = context
    push(`return `)
    genNode(node.return, context)
}

function genStringLiteral(node, context) {
    const { push } = context
    push(`${node.value}`)
}

function genCallExpression(node, context) {
    const { push } = context
    const { callee, arguments: args } = node
    push(`${callee.name}(`)
    genNodeList(args, context)
    push(`)`) 
}

function compile(template) {
    const ast = parse(template)
    transform(ast)
    const code = generate(ast.jsNode)
    console.log(code)
}

const template = '<div><p>Vue</p><p>Template</p></div>'
compile(template)