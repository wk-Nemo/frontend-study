const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js', // 入口, 可以为相对路径, 当然绝对路径也没错
  output: { // 输出配置
    publicPath: '/',
    path: path.join(__dirname, './dist'), // 输出的目录
    filename: 'bundle.js' // 输出的文件名
  },
  devServer: {
    contentBase: './dist',
    port: 3000,
    hot: true, // 开启 Hot Module Replacement 功能
    hotOnly: true // 即使 Hot Module Replacement 没有开启，也不会自动刷新浏览器
  },
  mode: 'development',
  devtool: 'cheap-source-map',
  // 类似于生命周期，在某个时刻做一些事情
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
              outputPath: 'images'
            }
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        }
      }
    ],
  }
}