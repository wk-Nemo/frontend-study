const { dump, parse } = require("./parse")

// function transformElement(node) {
//     if(node.type === 'Element' && node.tag === 'p') {
//         node.tag = 'h1'
//     }
// }

// function transformText(node, context) {
//     if(node.type === 'Text') {
//         // context.replaceNode({
//         //     type: 'Element',
//         //     tag: 'span'
//         // })
//         context.removeNode()
//     }
// }

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

const ast = parse('<div><p>Vue</p><p>Template</p></div>')
transform(ast)
console.log(ast)

module.exports = {
    transform
}