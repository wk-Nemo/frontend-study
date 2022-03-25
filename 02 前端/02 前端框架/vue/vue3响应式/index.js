const bucket = new Set()

const data = {
    text: 'Hello World'
}

function effect() {
    document.body.innerText = obj.text
}

const obj = new Proxy(data, {
    get(target, key) {
        bucket.add(effect)
        return target[key]
    },
    set(target, key, newVal) {
        target[key] = newVal
        bucket.forEach(fn => fn())
        return true
    }
})

effect()

setTimeout(() => {
    obj.text = 'Vue3'
})