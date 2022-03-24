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

const ast = parse('<div><p>Vue</p><p>Template</p></div>')
dump(ast)

const a = {
    type: "Root",
    children: [
        {
            type: "Element",
            tag: "div",
            children: [
                {
                    type: "Element",
                    tag: "p",
                    children: [
                        {
                            type: "Text",
                            content: "Vue"
                        }
                    ]
                },
                {
                    type: "Element",
                    tag: "p",
                    children: [
                        {
                            type: "Text",
                            content: "Template"
                        }
                    ]
                }
            ]
        }
    ]
}

module.exports = {
    parse,
    dump
}