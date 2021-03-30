var xhr = new XMLHttpRequest()

// open建立连接
xhr.open('GET', 'http://www.example.com/page.php', true)

// XMLHttpRequest状态一旦发生改变 ，就会调用监听函数handleStateChange
xhr.onreadystatechange = handleStateChange

function handleStateChange () {
    // 函数体
}

// 表示发送请求的时候不带有数据体 （GET）
// POST请求 需要指定数据体
xhr.send(null)

// 一旦拿到服务器数据，AJAX不会刷新整个网页，只是更新网页相关的部分
// 注意AJAX只能向同源网址（协议、域名、端口都相同）发出HTTP请求，也就是不能跨域


// 完整代码
var xhr = new XMLHttpRequest();

xhr.onreadystatechange = function(){
  // 通信成功时，状态值为4
  if (xhr.readyState === 4){
    if (xhr.status === 200){
      console.log(xhr.responseText);
    } else {
      console.error(xhr.statusText);
    }
  }
};

xhr.onerror = function (e) {
  console.error(xhr.statusText);
};

xhr.open('GET', '/endpoint', true);
xhr.send(null);

// XMLHttpRequest的实例属性
// 1.XMLHttpRequest.readyState
// 2.XMLHttpRequest.onreadystatechange
// 3.XMLHttpRequest.response
// 4.XMLHttprequest.responseType
// 5.XMLHttprequset.responseText
// 6.XMLHttprequest.responseXML
// 7.XMLHttprequest.responseURL
// 8.XMLHttprequest.status XMLHttprequest.statusText
// 9.XMLHttprequest.timeout XMLHttpRequestEventTarget.ontimeout

// XMLHttprequest的实例方法
// 1.XMLHttpreques.open()
// 2.XMLHttpreques.send()
// 3.XMLHttpreques.setEequestHeader()
// 4.XMLHttpreques.overrideMimeType()
// 5.XMLHttpreques.getResponseHeader()
// 6.XMLHttpreques.getAllResponseHeaders()
// 7.XMLHttpreques.abort()