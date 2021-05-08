function* helloWorld() {
	yield 'hello'
	yield 'world'
	return 'ending'
}

// var hw = helloWorld();

// console.log(hw.next())
// console.log(hw.next())
// console.log(hw.next())
// console.log(hw.next())
// console.log(hw.next())

function* f() {
	for (var i = 0; true; i++) {
		var reset = yield i;
		if (reset) {
			i = -1;
		}
	}
}

// var g = f();

// console.log(g.next())
// console.log(g.next())
// console.log(g.next())
// console.log(g.next(true))
// console.log(g.next())

function* foo() {
	yield 1;
	yield 2;
	yield 3;
	yield 4;
	yield 5;
	return 6
}

// for (let v of foo()) {
//     console.log(v)
// }

// var gen = function* gen() {
// 	yield console.log(1);
// 	yield console.log(2);
// }

// var g = gen();

// g.next()
// g.throw()
// g.next()

function* gen() {
	yield 1;
	yield 1;
	yield 3;
}

// var g = gen();

// console.log(g.next());
// console.log(g.return('foo'));
// console.log(g.next());

function* numbers() {
	yield 1;
	try {
		yield 2;
		yield 3;
	} finally {
		yield 4;
		yield 5;
	}
	yield 6;
}

// var g = numbers()

// console.log(g.next())
// console.log(g.next())
// console.log(g.return(7))
// console.log(g.next())
// console.log(g.next())

function* gen1() {
	yield* [1, 2, 3, 4]
}
var g = gen1()

console.log(g.next()) // { value: 1, done: false }
console.log(g.next()) // { value: 2, done: false }
console.log(g.next()) // { value: 3, done: false }
console.log(g.next()) // { value: 4, done: false }
console.log(g.next()) // { value: undefined, done: true}
