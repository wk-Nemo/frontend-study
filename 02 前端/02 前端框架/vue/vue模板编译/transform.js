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

const ast = parse('<div><p>Vue</p><p>Template</p></div>')
transform(ast)
console.log(ast)

module.exports = {
    transform
}