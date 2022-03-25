const { parse } = require("./parse");
const { transform } = require("./transform");


function compile(template) {
    // 生成模板AST
    const ast = parse(template)
    // 转换成JavaScriptAST
    transform(ast)
    // 生成渲染函数
    const code = generate(ast.jsNode)
    return code
}

const template = '<div><p>Vue</p><p>Template</p></div>'
compile(template)

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