class Student {
  constructor(name, number){
    this.name = name
    this.number = number
  }

  sayName() {
    console.log(this.name)
  }

  sayNumber() {
    console.log(this.number)
  }
}

// 父类
class People {
  constructor(name) {
    this.name = name
  }

  eat() {
    console.log(this.name + ' eat food')
  }
}

// 子类1
class Teacher extends People {
  constructor(name, id) {
    super(name)
    this.id = id
  }

  sayId() {
    console.log(this.id)
  }
}

// 子类2
class Coder extends People {
  constructor(name, company) {
    super(name)
    this.company = company
  }

  sayCompany() {
    console.log(this.company)
  }
}

let b = new Teacher("wk", 12)
b.eat()
b.sayId()

let c = new Coder("cy", "tencent")
c.eat()
c.sayCompany()

