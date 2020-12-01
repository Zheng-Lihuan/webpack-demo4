const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin') //自动生成html文件
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin') //清理dist目录
const MiniCssExtractPlugin = require('mini-css-extract-plugin') //分割css为单独文件
const OptimizeCss = require('optimize-css-assets-webpack-plugin') //压缩css
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin')
const webpack = require('webpack')


module.exports = {
  optimization: {
    minimizer: [
      new OptimizeCss(),//压缩css
      new UglifyjsWebpackPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      }),//压缩js
    ]
  },
  mode: 'development', //模式 开发模式：development 生产模式：production
  // mode:'production',//模式 开发模式：development 生产模式：production

  entry: './src/index.js',
  // entry:{
  //   index:'./src/index.js',
  //   other:'./src/other.js'
  // },

  output: {
    filename: '[name].[hash:8].js',
    path: path.resolve(__dirname, 'dist') //必须绝对路径
  },
  devServer: {
    port: '8000',
    progress: true,
    contentBase: './dist',
    compress: true,
  },
  module: {
    rules: [
      {
        test: /\.(htm|html)$/i,
        loader: 'html-withimg-loader'
      },
      {
        test: /\.(png|jpg|gif)$/,
        //图片大小小于限制，使用url-loader 生成base64文件 否则使用file-loader 产生真实的图片
        use: {
          loader: 'url-loader',
          options: {
            limit: 10 * 1024,
            outputPath: 'images/', //目录
            esModule: false, //为了消除版本冲突
          },

        }
      },
      {
        test: /\.(css|less)$/,
        use: [
          // MiniCssExtractPlugin.loader,
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../'
            },
          },//防止css中的图片路径不对问题

          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader'
          },
          {
            loader: 'less-loader',
          }
        ]
      },
      {
        test: /\.js$/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env' //把es6转为es5
            ],
            plugins: [
              ["@babel/plugin-proposal-decorators", {
                "legacy": true
              }], //转化装饰器语法
              ['@babel/plugin-proposal-class-properties', {
                "loose": true
              }] //转化class语法
            ]
          },

        }]
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      // title: 'Custom template',
      // filename:'index.html',
      template: './public/index.html',
    }),

    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/main.css'
    }), //分割css文件到单独的文件夹

    // new webpack.ProvidePlugin({
    //   $:'jquery',
    //   jQuery:'jquery',
    // }),//定义全局变量
  ],
  externals: {
    jquery: 'jQuery'
  } //不打包
}