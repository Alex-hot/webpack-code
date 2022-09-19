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
    rules: [],
  },
  //插件
  plugins: [
    // plugin的配置
  ],
  //模式
  mode: 'development',
};
