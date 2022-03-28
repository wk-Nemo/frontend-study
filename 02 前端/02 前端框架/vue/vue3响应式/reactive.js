const { effect, track, trigger } = require('./effect')

const obj = {
    foo: 1,
    get bar() {
        return this.foo
    }
}

const p = new Proxy(obj, {
    get(target, key, receiver) {
        track(target, key)
        return Reflect.get(target, key, receiver)
    },
    set(target, key, newVal) {
        target[key] = newVal
        trigger(target, key)
        return true
    }
})

effect(() => {
    console.log(p.bar)
})

effect(() => {
    console.log('foo', p.foo)
})

p.foo++
