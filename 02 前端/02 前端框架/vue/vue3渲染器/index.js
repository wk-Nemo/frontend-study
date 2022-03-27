const VueReactivity = require('@vue/reactivity')
const { createRender } = require('./render')

const { effect, ref } = VueReactivity

const { render } = createRender({
    createElement(tag) {
        console.log(`创建元素${tag}`)
        return { tag }
    },
    setElementText(el, text) {
        console.log(`设置 ${JSON.stringify(el)} 的文本内容：${text}`)
        el.text = text
    },
    setElementObj(el, obj) {
        console.log(`设置 ${JSON.stringify(el)} 的obj：${JSON.stringify(obj)}`)
        el.obj = obj
    },
    insert(el, parent, anchor = null) {
        console.log(`将 ${JSON.stringify(el)} 添加到 ${JSON.stringify(parent)} 下`)
        parent.children = el
    }
})

const count = ref(1)

effect(() => {
    const vnode = {
        type: 'h1',
        children: count.value
    }
    const container = { type: 'root' }
    render(vnode, container)
})

setTimeout(() => {
    count.value++
}, 1000)