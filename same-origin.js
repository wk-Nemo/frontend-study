// 受同源政策影响的应用：Cookie,iframe和多窗口通信,AJAX

// AJAX解决跨域的问题：JSONP、WebSocket、CORS

// 1.JSONP
// script标签没有同源限制，在网页添加一个script标签向服务器请求脚本
// 只能发get请求
function addScriptTag(src) {
  var script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.src = src;
  document.body.appendChild(script);
}

window.onload = function () {
  // callback参数告诉服务器客户端的回调函数名称  
  addScriptTag('http://example.com/ip?callback=foo');
}

function foo(data) {
  console.log('Your public IP address is: ' + data.ip);
};

// 服务器接收到请求后，将JSON数据放在函数名里面，作为字符串返回
foo({
    'ip': '8.8.8.8'
})

// 客户端会将服务器返回的字符串，作为代码解析，因为浏览器认为，这是<script>标签请求的脚本内容。
// 这时，客户端只要定义了bar()函数，就能在该函数体内，拿到服务器返回的 JSON 数据。

// 2.webSocket
// WebSocket 是一种通信协议，使用ws://（非加密）和wss://（加密）作为协议前缀。
// 该协议不实行同源政策，只要服务器支持，就可以通过它进行跨源通信。


// 3.CORS可以发任何请求


