class Animal {
  name: string;
  static categoies: string[] = ['mammal', 'bird']
  static isAnimal(a) {
    return a instanceof Animal
  }

  constructor(name: string) {
    this.name = name
  }

  run() {
    return `${this.name} is running`
  }
}

const snake = new Animal('lily')
console.log(snake.run())

console.log(Animal.isAnimal(snake))

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


interface Radio {
  switchRadio(): void; 
}

interface Battery {
  checkBatteryStatus();
}

interface RadioWithBattery extends Radio {
  checkBatteryStatus();
}

class Car implements Radio {
  switchRadio() {

  }
}

class CellPhone implements RadioWithBattery {
  switchRadio() {

  }

  checkBatteryStatus() {

  }
}