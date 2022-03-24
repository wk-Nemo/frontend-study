const { tokenSize } = require('./token')

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

// const ast = parse('<div><p>Vue</p><p>Template</p></div>')
// dump(ast)

module.exports = {
    parse,
    dump
}