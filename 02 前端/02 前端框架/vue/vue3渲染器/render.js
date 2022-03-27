// 渲染器
function createRender(options) {
    // 为跨平台准备
    const {
        createElement,
        insert,
        setElementText,
        setElementObj
    } = options

    function mountElement(vnode, container) {
        const el = createElement(vnode.type)
        if(typeof vnode.children === 'string') {
            setElementText(el, vnode.children)
        } else {
            setElementObj(el, vnode.children)
        }
        insert(el, container)
    }

    function patch(n1, n2, container) {
        if(!n1) {
            mountElement(n2, container)
        } else {

        }
    }

    function render(vnode, container) {
        if(vnode) {
            patch(container._vnode, vnode, container)
        } else {
            if(container._vnode) {
                container.innerHTML = ''
            }
        }
        container._vnode = vnode
    }

    return {
        render
    }
}

module.exports = {
    createRender
}
