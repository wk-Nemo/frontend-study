function echo<T>(arg: T): T {
  return arg
}

const result = echo(true)

function swap<T, U>(tuple: [T, U]): [U, T] {
  return [tuple[1], tuple[0]]
}

const result2 = swap(['str', 123])
result2[1]


function echoWithArr<T>(arg: T[]): T[] {
  console.log(arg.length)
  return arg
}

interface IWithLength {
  length: number
}

function echoWithLength<T extends IWithLength>(arg: T): T {
  console.log(arg.length)
  return arg
}

const str = echoWithLength('str')
const obj = echoWithLength({length: 10})
const arr2 = echoWithLength([1, 2, 3])

class Queue<T> {
  private data = []

  push(item: T) {
    return this.data.push(item)
  }

  pop(): T {
    this.data.shift()
  }
}

const queue = new Queue<number>()
queue.push(1)
queue.push(2)

const queue2 = new Queue<string>()
queue2.push('str')
queue2.push('mike')

interface: keyPair<T, U> {
  key: T;
  value: U;
}
let kp1: KeyPair<number, string> = { key:123, value:"str" }

let arr: number[] = [1, 2, 3]
let arr2: Array<number> = [1, 2, 3]

interface IPlus<T> {
  (a: T, b: T) : T
}

  function plus(a: number, b: number) : number {
    return a + b
  }

  function connect(a: string, b: string) : string {
    return a + b
  }

  const a: IPlus<number> = plus
  const b: IPlus<string> = connect
