let url = ''

/**
 * get请求
 */
const xhr = new XMLHttpRequest()
xhr.open('get', url, false)
xhr.onreadystatechange = function() {
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      console.log(xhr.responseText)
    }
  }
}
xhr.send(null)

/**
 * post请求
 */
const xhr = new XMLHttpRequest()
xhr.open('post', url, false)
xhr.onreadystatechange = function() {
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      console.log(xhr.responseText)
    }
  }
}

let data = {
  name: 'wk',
  password: 'xxx'
}

xhr.send(JSON.stringify(data))

/**
 * 跨域
 */

// jsonp