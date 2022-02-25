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

function ajax(url) {
  const p = new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest()
    xhr.open('get', url, true)
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          resolve(xhr.responseText)
        } else if (xhr.status == 400) {
          reject(new Error('404 not found'))
        }
      }
    }
    xhr.send(null)
  })
  return p;
}