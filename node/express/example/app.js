const express = require('express')
const app = express()
const port = 3001

// 设置路由
app.get('/', (req, res) => {
  res.send('hello world');
  console.log(`Example app listening at http://localhost:${port}`)
})

// 设置端口
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

// 托管静态文件
app.use(express.static('public'))