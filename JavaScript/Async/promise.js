// promise的简单使用
var promise = new Promise(function(resolve, reject){
    var a = 3
    var b = 2
    if (a < b) {
        resolve('yes')
    } else {
        reject('no')
    }
})

// promise.then(function(value){
//     console.log(value)
// }, function(error) {
//     console.log(error)
// })

// 再来一个简单的例子
function timeout(ms) {
    return new Promise(function(resolve, reject){
        setTimeout(resolve, ms, 'done')
    })
}
// timeout(5000).then((value)=>{
//     console.log(value)
// })

var p1 = new Promise(function (resolve, reject) {
    setTimeout(() => resolve('success', 1000))
})

var p2  = new Promise(function (resolve, reject){
    setTimeout(() => resolve(p1), 3000)
})

p2.then(result => console.log(result))
  .catch(error => console.log(error))