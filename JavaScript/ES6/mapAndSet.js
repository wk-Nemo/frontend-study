const s = new Set()
const arr = [2, 3, 4, 5, 5, 2, 6, 7]
arr.forEach(item => s.add(item))
for (let i of s) {
    console.log(i)
}

const s1 = new Set(arr)

// 数组去重
console.log([...new Set(arr)])

const arr2 = [
    [1, 'a'],
    [2, 'b']
]
const map = new Map()
arr2.forEach(([key, value]) => map.set(key, value))
for (let i of map) {
    console.log(i)
}
const map2 = new Map(arr2)
console.log(map2)
for (let i of map2) {
    console.log(i)
}
