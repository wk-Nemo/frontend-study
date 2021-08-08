let [a, [[b], c]] = [1, [[2], 3]]
console.log(a, b, c)

let [x = 1, y = 2] = [3, undefined]
console.log(x, y)

let { foo, bar } = { foo: 'aaa', bar: 'bbb'}
console.log(foo, bar)

let { foo: baz } = { foo: 'aaa', bar: 'bbb'}
console.log(baz)

function add ([x, y]) {
  return x + y
}

let arr = [[1, 2], [3, 4], [5, 6]].map(([a, b]) => a + b)
console.log(arr)

function move({x = 0, y = 5} = {}) {
  return x + y
}
console.log(move({x: 1}))

let map = new Map()
map.set('first', 'hello')
map.set('second', 'world')

for (let [key, value] of map) {
  console.log(key + ' is ' + value)
}

let value = '小猪皮皮呆'
console.log(`${value} is 帅小伙`)