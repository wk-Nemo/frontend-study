console.log(...[1, 2, 3, 4])

let arr1 = [1, 2, 3]
let arr2 = [4, 5, 6]
console.log([...arr1, ...arr2])

const [first, ...rest] = [1, 2, 3, 4, 5]
console.log(first)
console.log(rest)

function test() {
  console.log([...arguments]);
}
test(1, 2, 3, 4, 5)