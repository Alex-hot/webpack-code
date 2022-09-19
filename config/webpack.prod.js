const path = require('path'); //node.js核心模块，专门用来处理路径问题
const ESlintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const getStyleLoader = (preProcessor) => {
  return [
    MiniCssExtractPlugin.loader,
    'css-loader',
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [
            'postcss-preset-env', // 能解决大多数样式兼容性问题
          ],
        },
      },
    },
    preProcessor,
  ].filter(Boolean);
};

module.exports = {
  //入口
  entry: './src/main.js',
  //输出
  output: {
    //文件的输出路径
    // __dirname node.js的变量，代表当前文件的文件夹目录
    path: path.resolve(__dirname, '../dist'), //绝对路径
    //入口文件打包输出的文件名
    filename: 'js/main.js',
    clean: true, // 自动将上次打包目录资源清空
  },
  //加载器
  module: {
    rules: [
      // loader的配置
      {
        test: /\.css$/, // 只检测css结尾的文件
        use: getStyleLoader(),
      },
      {
        test: /\.less$/,
        //loader：xxx,只能使用一个
        use: getStyleLoader('less-loader'),
      },
      {
        test: /\.s[ac]ss$/,
        use: getStyleLoader('sass-loader'),
      },
      {
        test: /\.styl$/,
        use: getStyleLoader('stylus-loader'),
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
    new MiniCssExtractPlugin({
      filename: 'css/main.css',
    }),
    new CssMinimizerPlugin(),
  ],
  //模式
  mode: 'production',
};
