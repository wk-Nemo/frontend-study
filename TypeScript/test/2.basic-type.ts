// 基础类型
let isDone: boolean = true

let age: number = 20

let firstName: string = "wu"

let u: undefined = undefined
let n: null = null

// undefined 和 null 可以赋值给任何类型
let num: number = undefined
let str: string = null

// any 表示任何类型
let notSure: any = 4
notSure = 'string'
notSure = true

// 联合类型
let numberOrString: number | string = 234
numberOrString = 'str'

// arr 和 tuple
let arrOfNumber: number[] = [1, 2, 3, 4]
arrOfNumber.push(5)

// tuple 元组对数组进行了一个更精准的限制
let user: [string, number] = ['viking', 20]
