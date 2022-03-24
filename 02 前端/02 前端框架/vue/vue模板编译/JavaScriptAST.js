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