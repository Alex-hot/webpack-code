const path = require('path'); //node.js核心模块，专门用来处理路径问题
module.exports = {
  //入口
  entry: './src/main.js',
  //输出
  output: {
    //文件的输出路径
    // __dirname node.js的变量，代表当前文件的文件夹目录
    path: path.resolve(__dirname, 'dist'), //绝对路径
    //文件名
    filename: 'main.js',
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
    ],
  },
  //插件
  plugins: [
    // plugin的配置
  ],
  //模式
  mode: 'development',
};
