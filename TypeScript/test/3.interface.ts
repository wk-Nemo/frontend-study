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
