const os = require('os');
const path = require('path'); //node.js核心模块，专门用来处理路径问题
const ESlintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

const threads = os.cpus().length; //cpu核数

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
        use: [
          {
            loader: 'thread-loader', //开启多进程
            options: {
              works: threads,
            },
          },
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true, // 开启babel编译缓存
              cacheCompression: false, // 缓存文件不要压缩
              plugins: ['@babel/plugin-transform-runtime'], // 减少代码体积
            },
          },
        ],
      },
    ],
  },
  //插件v
  plugins: [
    // plugin的配置
    new ESlintPlugin({
      context: path.resolve(__dirname, '../src'),
      cache: true,
      exclude: 'node_modules',
      cacheLocation: path.resolve(__dirname, '../node_modules/.cache/.eslintcache'),
      threads, //开启多进程和设置进程数量
    }),
    new HtmlWebpackPlugin({
      //模板，以public/index.html文件创建新的html文件
      //新的文件特点：1：结构和原来一致，2会自动引入打包的输出资源
      template: path.resolve(__dirname, '../public/index.html'),
    }),
    new MiniCssExtractPlugin({
      filename: 'css/main.css',
    }),
    // new CssMinimizerPlugin(),
    // new TerserWebpackPlugin({
    //   parallel: threads, // 开启多进程
    // }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      // css压缩也可以写到optimization.minimizer里面，效果一样的
      new CssMinimizerPlugin(),
      // 当生产模式会默认开启TerserPlugin，但是我们需要进行其他配置，就要重新写了
      new TerserPlugin({
        parallel: threads, // 开启多进程
      }),
      // 压缩图片
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminGenerate,
          options: {
            plugins: [
              ['gifsicle', { interlaced: true }],
              ['jpegtran', { progressive: true }],
              ['optipng', { optimizationLevel: 5 }],
              [
                'svgo',
                {
                  plugins: [
                    'preset-default',
                    'prefixIds',
                    {
                      name: 'sortAttrs',
                      params: {
                        xmlnsOrder: 'alphabetical',
                      },
                    },
                  ],
                },
              ],
            ],
          },
        },
      }),
    ],
  },
  //模式
  mode: 'production',
  devtool: 'source-map',
};
