const fs = require('fs');
const game = require('./game')
const express = require('express');

var playerWinCount = 0;
var lastPlayerAction = null;
var sameCount = 0;

const app = express();

app.get('/favicon.ico', function (request, response) {
  // 一句 status(200) 代替 writeHead(200); end();
  response.status(200)
  return;
})

app.get('/game',
  function (request, response, next) {
    if (playerWinCount >= 3 || sameCount == 9) {
        response.status(500);
        response.send('我不会再玩了！');
        return;
    }

    // 通过next执行后续中间件
    next();

    // 当后续中间件执行完之后，会执行到这个位置
    if (response.playerWon) {
        playerWinCount++;
    }
  },

  function (request, response, next) {
    // express自动帮我们把query处理好挂在request上
    const query = request.query;
    const playerAction = query.action;

    if (!playerAction) {
        response.status(400);
        response.send();
        return;
    }

    if (lastPlayerAction == playerAction) {
        sameCount++
        if (sameCount >= 3) {
            response.status(400);
            response.send('你作弊！我再也不玩了');
            sameCount = 9
            return;
        }
    } else {
        sameCount = 0;
    }
    lastPlayerAction = playerAction;

    // 把用户操作挂在response上传递给下一个中间件
    response.playerAction = playerAction
    next();
  },

  function (req, response) {
    const playerAction = response.playerAction;
    const result = game(playerAction);

    // 如果这里执行setTimeout，会导致前面的洋葱模型失效
    // 因为playerWon不是在中间件执行流程所属的那个事件循环里赋值的
    // setTimeout(()=> {
        response.status(200);
        if (result == 0) {
            response.send('平局')

        } else if (result == -1) {
            response.send('你输了')

        } else {
            response.send('你赢了')
            response.playerWon = true;

        }
    // }, 500)
  }
)

app.get('/', function (request, response) {
  // send接口会判断你传入的值的类型，文本的话则会处理为text/html
  // Buffer的话则会处理为下载
  response.send(
      fs.readFileSync(__dirname + '/index.html', 'utf-8')
  )
})

app.listen(3000);