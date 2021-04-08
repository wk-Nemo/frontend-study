function* helloWorldGenerator() {
    yield 'hello'
    yield 'world'
    return 'ending'
}

var hw = helloWorldGenerator()
// console.log(hw.next())
// console.log(hw.next())
// console.log(hw.next())
// console.log(hw.next())

const arr = [1, [[2, 3], 4], [5, 6]]
const flat = function* (a) {
    var length = a.length
    for (var i = 0; i < length; i++) {
        var item = a[i]
        if (typeof item !== 'number') {
            yield* flat(item)
        } else {
            yield item
        }
    }
}
// for (let f of flat(arr)) {
//     console.log(f)
// }
const test = flat(arr)
console.log(test.next())
console.log(test.next())
console.log(test.next())
console.log(test.next())
console.log(test.next())
console.log(test.next())
console.log(test.next())

