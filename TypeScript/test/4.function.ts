function add(x: number, y: number, z?: number): number {
  if(typeof z === 'number') {
    return x + y + z
  }

  return x + y
}

const add2: (x: number, y: number, z?: number) => number = add

let result: number = add(2, 3)
console.log(result)

result = add(2, 3, 4)
console.log(result)
