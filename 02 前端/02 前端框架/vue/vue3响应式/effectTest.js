const { track, trigger, effect } = require('./effect')

const data = {
    foo: 1,
    bar: 2
}

const obj = new Proxy(data, {
    get(target, key) {
        track(target, key)
        return target[key]
    },
    set(target, key, newVal) {
        target[key] = newVal
        trigger(target, key)
        return true
    }
})

effect(() => {
    console.log(obj.bar + obj.foo)
})

obj.foo++
obj.bar++
