## 什么是TypeScript

- JavaScript的超集
- 静态类型风格的类型系统
- 从es6到es10甚至事esnext的语法支持
- 兼容各种浏览器，各种系统，各种服务器，完全开源



## 为什么使用TypeScript

- 程序更容易理解
  - 函数或方法输入输出参数类型，外部条件
  - 动态语言的约束：需要手动调试等过程
  - TypeScript：代码本身就可以解决上述问题

- 效率更高
  - 在不同代码块和定义之间进行跳转
  - 代码自动补全
  - 丰富的接口提示
- 更少的错误
  - 编译期间发现大部分错误
  - 杜绝一些常见的错误
- 更好的包容性
  - 完全兼容JavaScript
  - 第三方库可以单独编写类型文件
  - 流行项目支持TypeScript-React、Vue、Angular、Ant Design等
- 一些缺点
  - 增加了学习成本
  - 短期内增加了开发成本
  - 要根据需求和工程规模合理选择



## 安装TypeScript

```javascript
npm install -g typescript
npm install -g ts-node
```

`ts-node`可以合并typescript的编译和运行两个步骤



## 定义类型

#### 1. 基本类型判断

```typescript
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

```



#### 2. interface 接口

- 对对象的形状进行描述
- 对类（class）进行抽象
- 鸭子类型（Duck Typing）

```typescript
// readonly 只读不可修改
// ? 表示不一定必须有该属性
interface Person {
  readonly name: string;
  age: number;
  school?: string;
}

let viking: Person = {
  name: 'viking',
  age: 20
}

let wk: Person = {
  name: 'wk',
  age: 18,
  school: 'WHUT'
}
```



#### 3. 函数

```typescript
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
```



#### 4. 类型判断

当我们没有显示的声明时，TypeScript会自动推测一个类型。

```typescript
let str = 'str'
str = 123 // 报错
```



#### 5. 类

- 类（Class）：定义了一切事务的抽象特点
- 对象（Object）：类的实例
- 面向对象（OOP）三大特性：封装、继承、多态

```typescript
class Animal {
  name: string;

  constructor(name: string) {
    this.name = name
  }

  run() {
    return `${this.name} is running`
  }
}

const snake = new Animal('lily')
console.log(snake.run())

class Dog extends Animal {
  bark() {
    return `${this.name} is barking`
  }
}

const mike = new Dog('Mike')
console.log(mike.run())
console.log(mike.bark())


class Cat extends Animal {
  constructor(name) {
    super(name)
  }

  run() {
    return `Meow, ` + super.run()
  }
}
const cat = new Cat('maomao')
console.log(cat.run())
```



ts还添加了几种修饰符

- public：都可以访问
- private：只有自己可访问
- protected：自己和子类可以访问
- readonly：只读
- static：添加静态属性和静态方法



## 泛型（Generics）

泛型主要是定义了不确定的类型，在使用的时候再确定。

```javascript
function echo<T>(arg: T): T {
  return arg
}

const result = echo(true)

function swap<T, U>(tuple: [T, U]): [U, T] {
  return [tuple[1], tuple[0]]
}

const result2 = swap(['str', 123])
result2[1]
```



#### 1. 泛型约束

使用interface对泛型进行约束

```typescript
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
```



#### 2. 类

```typescript
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
```



#### 3. 接口

```typescript
interface: keyPair<T, U> {
  key: T;
  value: U;
}

let kp1: KeyPair<number, string> = { key:123, value:"str" }
```



#### 4. 数组

```typescript
let arr: number[] = [1, 2, 3]
let arr2: Array<number> = [1, 2, 3]
```



#### 5. 函数

```typescript
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
```



## 类型别名

```typescript
type PlusType = (x: number, y: number) => number

function sum(x: number, y: number): number {
  return x + y
}

const sum2: PlusType = sum
```



#### 1. 联合类型

```typescript
type NameResolver = () => string
type NameOrResolver = string | NameResolver
function getName(n: NameOrResolver): string {
  if(typeof n === 'string') {
    return n
  }

  return n()
}
```



## 类型断言

通过`as`表示你对一些类型的判断

```typescript
function getLength(input: string | number): number {
  const str = input as String
  if(str.length) {
    return str.length
  }

  return str
}
```



另一种方法

```typescript
function getLength(input: string | number): number {
  if((<string>input).length) {
    return (<string>input).length
  }

  return input.toString().length
}
```



