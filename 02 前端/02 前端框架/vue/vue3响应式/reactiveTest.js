const { reactive } = require('./reactive') 
const { effect } = require('./effect')

// const obj = {}
// const proto = { bar: 1 }
// const child = reactive(obj)
// const parent = reactive(proto)
// Object.setPrototypeOf(child, parent)

// effect(() => {
//     console.log(child.bar)
// })

// child.bar = 2

// let arr = reactive(['foo'])

// effect(() => {
//     console.log('-----start----')
//     for(const key in arr) {
//         console.log(arr[key])
//     }
// })

// arr[1] = 'bar'
// arr.length = 0

const obj = {}
const arr = reactive([obj])

console.log(arr.includes(arr[0]))
