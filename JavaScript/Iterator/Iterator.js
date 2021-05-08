function makeIterator(arr) {
  var nextIndex = 0;
  return {
    next: function () {
      return nextIndex < arr.length ? 
      {value: arr[nextIndex++], done: false} :
      {value: undefined, done: true}
    }
  }
}

var it = makeIterator([1,2,3,4,5]);


console.log(it.next())
console.log(it.next())
console.log(it.next())
console.log(it.next())
console.log(it.next())
console.log(it.next())
