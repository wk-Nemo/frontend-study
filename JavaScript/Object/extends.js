// 借助call
function Parent1() {
  this.name = 'parent1'
}

function Child1() {
  Parent1.call(this)
  this.type = 'child1'
}

// console.log(new Child1)

// 原型链继承
// 但是原型链的父类方法和属性所有的子类都可以访问
function Parent2() {
  this.name = 'parent2'
  this.play = [1, 2, 3]
}

function Child2() {
  this.type = 'Child2'
}

Child2.prototype = new Parent2()
const child = new Child2()
const child1 = new Child2()
child.play.push(5)
console.log(child.play, child1.play)

// call和原型链的组合
function Parent3() {
  this.name = 'parent3'
  this.play = [1, 2, 3]
}

function Child3() {
  Parent3.call(this)
  this.type = 'child3'
}
Child3.prototype = new Parent3()
var s3 = new Child3()
var s4 = new Child3()
s3.play.push(4)
console.log(s3.play, s4.play)

// 组合继承
function Parent4() {
  this.name = 'parent4'
  this.play = [1, 2, 3]
}

function Child4() {
  Parent4.call(this)
  this.type = 'child4'
}

Child4.prototype = Object.create(Parent4.prototype)
Child4.prototype.constructor = Child4

// ES6的class
class Animal {
  constructor(name) {
      this.name = name
  } 
  getName() {
      return this.name
  }
}
class Dog extends Animal {
  constructor(name, age) {
      super(name)
      this.age = age
  }
}
