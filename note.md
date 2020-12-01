## webpack的功能

代码转换 代码优化 代码分割 模块合并 自动刷新 代码校验 自动发布

## 项目初始化

- 初始化 package.json   yarn init -y  |  npm init -y
- 下载webpack webpack-cli   yarn add webpack webpack-cli -D
- 创建webpack.config.js 文件

## 基础配置

```
 webpack.config.js
 
 module.exports={
  mode:'production',//模式 development production
  entry:'./src/index.js',//入口
  output:{
    filename:'[name].[hash:8].js',
    path:path.resolve(__dirname,'dist'),//必须为绝对路径
  }
}
```

## 配置开发服务器

 安装 webpack-dev-server : yarn add webpack-dev-server -D

```
webpack.config.js 配置开发服务器

module.exports={
  devServer:{
    port:'3000',
    progress:true,
    contentBase:'./dist',
    compress:true,
  }
}
```

```
package.json

"scripts":{
  "dev":"webpack-dev-server",
  "build":"webpack --config webpack.config.js --mode production"
  }
```

### 安装配置html-webpack-plugin 插件（自动生成模板页面）

```
webpack.config.js

module.exports={
  plugins:[
    new HtmlWebpackPlugin({
      title:'webpack-demo',
      filename:'index.html',
      template:'./public/index.html'
      hash:true
    })
  ]
}
```

### 安装配置 clean-webpack-plugin 插件 （清理dist文件夹）

```
webpack.config.js

const { CleanWebpackPlugin } = require('clean-webpack-plugin')
module.exports={
	plugins:[
		new CleanWebpackPlugin()
	]
}
```

### 处理css less 文件 

```
安装style-loader css-loader less-loader  

webpack.config.js

module.exports={
	module:{
    rules:[
      {
        test:/\.(css|less)$/,
        use:[
          {
            //style-loader :把css插入到head标签中
            loader:'style-loader',
          },
          {
            loader:'css-loader',
          },
          {
            loader:'less-loader',
          }
        ]
      }
    ],
  },
}
```

### 分离css文件 mini-css-extract-plugin ,会生成单独的css文件

```
安装 mini-css-extract-plugin 

webpack.config.js
const MiniCssExtractPlugin=require('mini-css-extract-plugin')
module.exports={
	module:{
    rules:[
      {
        test:/\.(css|less)$/,
        use:[
         	MiniCssExtractPlugin.loader,
          {
            loader:'css-loader',
          },
          {
            loader:'less-loader',
          }
        ]
      }
    ],
  },
  plugins:[
  	new MiniCssExtractPlugin()
  ]
}
```

### 自动添加浏览器前缀( postcss-loader ,autoprefixer)

```
webpack.config.js

module.exports={

	module:{
    rules:[
      {
        test:/\.(css|less)$/,
        use:[
          MiniCssExtractPlugin.loader,
          {
            loader:'css-loader',
          },
          {
            loader:'postcss-loader'
          },
          {
            loader:'less-loader',
          }
        ]
      }
    ],
  },
}
```

```
postcss.config.js

module.exports={
  plugins:[require('autoprefixer')]
}
```

```
package.json

"browserslist": [
  "> 1%",
  "last 2 versions"
]
```

遇到的问题：

```
Error: PostCSS plugin autoprefixer requires PostCSS 8. Update PostCSS or downgrade this plugin.

https://blog.csdn.net/FormAda/article/details/109029274
解决方案：降低autoprefixer版本   yarn add autoprefixer@8.0.0 -D

```

### 压缩css代码 （optimize-css-assets-webpack-plugin）

```
const OptimizeCss=require('optimize-css-assets-webpack-plugin')
module.exports={
  optimization:{
    minimizer:[
    	new OptimizeCss()
    ]
  },
}
```

### 压缩js代码 （uglifyjs-webpack-plugin）

```
webpack.config.js

const  UglifyjsWebpackPlugin=require('uglifyjs-webpack-plugin')
module.exports={
  optimization:{
    minimizer:[
      new UglifyjsWebpackPlugin({
        cache:true,
        parallel:true,
        sourceMap:true,
      })
    ]
  },
```

### 转化js语法

把es6语法转化为es5 babel-loader @babel/core @babel/preset-env

转化class语法 @babel/plugin-proposal-class-properties

转化装饰器 @babel/plugin-proposal-decorators 

```
webpack.config.js

module.exports={

	module:{
		rules:[
			{
				test:/\.js$/,
				use:[
					{
					loader:'babel-loader',
					options:{
						presets:['@babel/preset-env'],
						plugins:[
            	["@babel/plugin-proposal-decorators",{"legacy":true}],//转化装饰器语法
                ['@babel/plugin-proposal-class-properties',{"loose":true}]//转化class语法
            ]
					}
					}
				]
			}
		]
	}
}
```

## 配置常用库为全局变量（jquery）

```
webpack.config.js

new webpack.ProvidePlugin({
  $:'jquery',
  jQuery:'jquery',
}),//定义全局变量
```

## 配置图片的处理（url-loader file-loader htm-withimg-loader）

```
webpack.config.js

module.exports={
	module:{
		rules:[
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
        test: /\.(htm|html)$/i,
        loader: 'html-withimg-loader',//转化html中的图片
      },
      {
        test:/\.(png|jpg|gif)$/,
        //图片大小小于限制，使用url-loader 生成base64文件 否则使用file-loader 产生真实的图片
        use:{
          loader :'file-loader',
          options:{
            limit:200*1024,
            esModule:false,//为了消除版本冲突
            outputPath:'imgs/',//把图片打包到imgs文件夹
          }
        }
      },
		]
	}
}

```





















## 多线程打包 happypack





## 配置抽离功能代码

```
webpack.config.js

optimization: {
    splitChunks: { 
      cacheGroups: {
        common:{//抽离公共的业务代码
          chunks:'initial',
          minSize:0,
          minChunks:1,
        },
        vendor:{ //抽离第三方包
          priority:1, //权重
          test:/node_modules/,
          chunks:'initial',
          minSize:0,
          minChunks:1,
        }
      }
    }

  },

```

## 语法动态导入插件：@babel/plugin-syntax-dynamic-import

用于解决webpack项目中的懒加载js

```
let button = document.createElement('button');
button.innerHTML='click'

button.addEventListener('click',function(){
  console.log('btn click');
  import('./data.js').then(data=>{
    console.log('data',data);
  })
})

document.body.appendChild(button)
```

```
webpack.config.js 配置

{
   test: /\.js$/,
   use: {
      loader: 'babel-loader',
      options: {
         presets: [
            '@babel/preset-env'
         ],
         plugins: [
           ["@babel/plugin-proposal-decorators", {
               "legacy": true
           }],
           ["@babel/plugin-proposal-class-properties", {
              "loose": true
           }],
           "@babel/plugin-transform-runtime",
            "@babel/plugin-syntax-dynamic-import"
         ]
      },
    },
    include: path.resolve(__dirname, 'src'),
    exclude: /node_modules/,
},
```

## 热更新

```
devServer:{
  hot:true,
},

new webpack.HotModuleReplacementPlugin()
```

## npm 依赖包版本

- ~ 会匹配最近的小版本依赖包，比如~1.2.3会匹配所有1.2.x版本，但是不包括1.3.0
- ^ 会匹配最新的大版本依赖包，比如^1.2.3会匹配所有1.x.x的包，包括1.3.0，但是不包括2.0.0
- `* `这意味着安装最新版本的依赖包

## 遇到的一些问题

- 报错问题

```
Error: Cannot find module 'webpack-cli/bin/config-yargs'
webpack-dev-serer 和 webpack 发生冲突
```





