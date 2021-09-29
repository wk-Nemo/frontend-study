type PlusType = (x: number, y: number) => number

function sum(x: number, y: number): number {
  return x + y
}

const sum2: PlusType = sum

type NameResolver = () => string
type NameOrResolver = string | NameResolver
function getName(n: NameOrResolver): string {
  if(typeof n === 'string') {
    return n
  }

  return n()
}

function getLength(input: string | number): number {
  const str = input as String
  if(str.length) {
    return str.length
  }

  return str
}

function getLength(input: string | number): number {
  if((<string>input).length) {
    return (<string>input).length
  }

  return input.toString().length
}