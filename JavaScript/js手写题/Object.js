/**
 * js如何创建对象
 */

// 1. 使用Object创建
// 缺点： 复用性差
let person = {
  name: 'wk',
  age: 18,
  getName: function () {
    console.log(this.name);
  }
}

// 2. 工厂模式
// 缺点：无法判断类型
function createPerson(name, age) {
  let o = new Object;
  o.name = name;
  o.age = age;
  o.getName = function () {
    console.log(this.name)
  }
}

// 3. 构造函数模式
// 缺点：一些公共的部分不希望重复创建
function Person(name, age) {
  this.name = name;
  this.age = age;
  this.getName = function() {
    console.log(this.name)
  }
}

// 4. 原型模式
// 缺点： 一些个人字段不希望是公共的
function Person() {}
Person.prototype.name = "wk"
Person.prototype.age = 18
Person.prototype.getName = function() {
  console.log(this.name);
}

// 5. 组合模式
// 结合了构造函数模式和原型模式的优点
function Person(name, age) {
  this.name = name;
  this.age = age;
}
Person.prototype.getName = function() {
  console.log(this.name)
}

/**
 * js实现继承
 */

// 1. 原型链继承
// 缺点：
//（1）父类的所有引用属性（info）会被所有子类共享，更改一个子类的引用属性，其他子类也会受影响
//（2）子类型实例不能给父类型构造函数传参
function Parent() {
  this.name = "wk";
}
Parent.prototype.getName = function() {
  console.log(this.name);
}
function Child(age) {
  this.age = age
}
Child.prototype = new Parent()
Child.prototype.getAge = function() {
  console.log(this.age)
}

let child = new Child(18)
child.getName()
child.getAge()


// 2. 借助构造函数
function Parent(name, age) {
  this.name = name;
  this.age = age;
}
Parent.prototype.getName = function() {
  console.log(this.name);
}
function Child(name, age, job) {
  Parent.call(this, name, age)
  this.job = job;
}
let child = new Child('wk', 18, 'coder');
child.getName()

// 3. 组合继承
function Parent(name, age) {
  this.name = name;
  this.age = age;
}
Parent.prototype.getName = function() {
  console.log(this.name);
}
function Child(name, age, job) {
  Parent.call(this, name, age)
  this.job = job;
}
Child.prototype = new Parent();

let child = new Child('wk', 18, 'coder');
child.getName();

// 4. 原型式继承
function objectCopy(obj) {
  function Fun() { };
  Fun.prototype = obj;
  return new Fun()
}

let person = {
  name: "wk",
  age: 18,
  friends: ["jack", "tom", "rose"],
  sayName:function() {
    console.log(this.name);
  }
}

let person1 = objectCopy(person);
person1.name = "wxb";
person1.friends.push("lily");
person1.sayName(); // wxb

let person2 = objectCopy(person);
person2.name = "gsr";
person2.friends.push("kobe");
person2.sayName(); // "gsr"

console.log(person.name);
console.log(person.friends); // ["jack", "tom", "rose", "lily", "kobe"]

// 5. 寄生式继承
function objectCopy(obj) {
  function Fun() { };
  Fun.prototype = obj;
  return new Fun();
}


function createAnother(original) {
  let clone = objectCopy(original);
  clone.getName = function () {
    console.log(this.name);
  };
  return clone;
}

let person = {
  name: 'wk',
  friend: ["rose", "tom", "jack"],
}

let person1 = createAnother(person);
person1.friends.push("lily");
console.log(person1.friends);
person1.getName(); // wk

let person2 = createAnother(person);
console.log(person2.friends); // ["rose", "tom", "jack", "lily"]

// 寄生组合继承
function Parent(name) {
  this.name = name;
  this.friends = ["rose", "lily", "tom"]
}
Parent.prototype.getName = function () {
  console.log(this.name);
}

function Child(name, age) {
  Parent.call(this, name);
  this.age = age;
}
Child.prototype = Object.create(Parent.prototype); // 效果类似寄生继承里的objectCopy
Child.prototype.constructor = Child; // 改变了prototype就会改变constructor，再将其指回Child
Child.prototype.getAge = function () {
  console.log(this.age);
}

let child1 = new Child("wk", 18);
child1.getAge(); // 18
child1.getName(); // wk
child1.friends.push("jack");
console.log(child1.friends); // ["rose", "lily", "tom", "jack"]

let child2 = new Child("cy", 21);
child2.getAge(); // 21
child2.getName(); // cy
console.log(child2.friends); // ["rose", "lily", "tom"]

/**
 * 拷贝
 */

// 浅拷贝
function shallowCopy(obj) {
  if (typeof obj !== 'object') {
    return false;
  }
  let newObj = Array.isArray(obj) ? [] : {}
  for (let i in obj) {
    // Obj.hasOwnProperty判断属性是实例上的还是原型上的
    if (obj.hasOwnProperty(i)) {
      newObj[i] = obj[i]
    }
  } 
}

// 深拷贝
function jsonCopy(obj) {
  return JSON.parse(JSON.stringify(obj))
}


function deepCopy(target) {
  if (typeof target !== 'object' || obj == null) {
    return target
  }
  let cloneObj = Array.isArray(target) ? [] : {};
  for (let i in target) {
    if (target.hasOwnProperty(i)) {
      cloneObj[i] = deepCopy(target[i])
    }
  }
  return cloneObj;
}

// 手写原型链
function child() {
  this.name = "child"
}

function father() {
  this.name = "father"
}

father.prototype.sayName = function() {
  console.log(this.name)
}

child.prototype = Object.create(father.prototype)

