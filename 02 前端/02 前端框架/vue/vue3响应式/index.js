const { track, trigger, effect } = require('./effect')
const { computed } = require('./computed')

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

const sumRes = computed(() => obj.foo + obj.bar)

// console.log(sumRes.value)
// console.log(sumRes.value)

effect(() => {
    console.log(sumRes.value)
})

obj.foo++

// console.log(sumRes.value)