const path = require('path'); //node.js核心模块，专门用来处理路径问题
const ESlintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  //入口
  entry: './src/main.js',
  //输出
  output: {
    //文件的输出路径
    //开发模式没有输出
    path: undefined,
    //入口文件打包输出的文件名
    filename: 'js/main.js',
  },
  //加载器
  module: {
    rules: [
      // loader的配置
      {
        test: /\.css$/, // 只检测css结尾的文件
        use: [
          //执行顺序 从右到左（从下到上）
          'style-loader', // 将js中css通过创建style标签添加到html文件中生效
          'css-loader', // 将css资源编译成commonjs模块到js中
        ],
      },
      {
        test: /\.less$/,
        //loader：xxx,只能使用一个
        use: [
          //可以使用多个loader
          // compiles Less to CSS
          'style-loader',
          'css-loader',
          'less-loader', //将less文件编译成css文件
        ],
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          // 将 JS 字符串生成为 style 节点
          'style-loader',
          // 将 CSS 转化成 CommonJS 模块
          'css-loader',
          // 将 Sass 编译成 CSS
          'sass-loader',
        ],
      },
      {
        test: /\.styl$/,
        use: ['style-loader', 'css-loader', 'stylus-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|webp|svg)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 50 * 1024, // 10kb  //小于50kb图片转base64
          },
        },
        generator: {
          //输出图片名称
          filename: 'images/[hash:10][ext][query]',
        },
      },
      {
        test: /\.(ttf|woff2?)$/,
        type: 'asset/resource',
        generator: {
          //输出名称
          filename: 'fonts/[hash:10][ext][query]',
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        // options: {
        //   presets: ['@babel/preset-env'],
        // },
      },
    ],
  },
  //插件v
  plugins: [
    // plugin的配置
    new ESlintPlugin({
      context: path.resolve(__dirname, '../src'),
    }),
    new HtmlWebpackPlugin({
      //模板，以public/index.html文件创建新的html文件
      //新的文件特点：1：结构和原来一致，2会自动引入打包的输出资源
      template: path.resolve(__dirname, '../public/index.html'),
    }),
  ],
  //模式
  mode: 'development',
  // 开发服务器
  devServer: {
    open: true,
  },
  devtool: 'cheap-module-source-map',
};
