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

module.exports = {
    tokenSize
}