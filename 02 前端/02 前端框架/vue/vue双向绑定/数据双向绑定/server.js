const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const config = require('./webpack.config');
const complier = webpack(config);

const app = express();
app.use(webpackDevMiddleware(complier,{
  publicPath: config.output.publicPath
}))

app.listen(3000, function () {
  console.log('server is running');
})