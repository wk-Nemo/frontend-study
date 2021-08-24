const flatReserve = function (a) {
  // 实现数组 b = [4,[3,[2,[1,null]]]]
  let path = []
  while(a){
      path.push(a.shift())
      a = a[0]
  }
  console.log(path)
  let real = [a]
  while(path.length){
      let arr = []
      arr.unshift(path.shift(), real[0] ? real.slice() : null)
      real = arr
      console.log(real)   
  }
  console.log(real)
}

let a = [1,[2,[3,[4,null]]]]

flatReserve(a)
