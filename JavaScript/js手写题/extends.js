function People(name, age) {
  this.name = name;
  this.age = age;
}
People.prototype.sayName = function() {
  console.log(this.name)
}
People.prototype.sayAge = function() {
  console.log(this.age)
}

function Student(name, age, id) {
  People.call(this, name, age);
  this.id = id
}
Student.prototype = new People()
Student.prototype.sayId = function () {
  console.log(this.id)
}

let wk = new Student("wk", 18, 123)
wk.sayName()
wk.sayAge()
wk.sayId()