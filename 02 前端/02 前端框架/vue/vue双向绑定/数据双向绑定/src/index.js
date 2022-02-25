// var MVVM = require('./mvvm')

// var tencent = require('./tencent.jpg')
// console.log(tencent.default)
// var img = new Image()
// img.src = tencent.default
// document.getElementById('root').append(img)
// console.log('提升效率3311')

// import './style.css'
// var btn = document.createElement('button')
// btn.innerHTML = '新增'
// document.body.appendChild(btn)

// btn.onclick = function () {
//   var div = document.createElement('div')
//   div.innerHTML = "item"
//   document.body.append(div)
// }

// import "@babel/polyfill";
const MVVM = require('./mvvm')

var vm = new MVVM({
  el: '#mvvm-app',
  data: {
    title: 'hello world'
  },
  methods: {
    clickBtn: function (e) {
      this.title = 'hello world';
    }
  },
});
