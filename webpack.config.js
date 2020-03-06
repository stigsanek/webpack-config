const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// Styles function
const styleLoader = param => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: { publicPath: '../' }
    },
    'css-loader',
    {
      loader: 'postcss-loader',
      options: {
        config: { path: './postcss.config.js' }
      }
    }
  ];

  if (param) {
    loaders.push(param);
  }

  return loaders;
};

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    app: './index.js'
  },
  output: {
    filename: 'js/[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, 'src/favicon.ico'),
        to: path.resolve(__dirname, 'dist')
      },
      {
        from: path.resolve(__dirname, 'src/img'),
        to: path.resolve(__dirname, 'dist/img')
      }
    ]),
    new HTMLWebpackPlugin({
      template: './index.html',
      minify: {
        collapseWhitespace: true
      }
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css'
    })
  ],
  module: {
    rules: [
      // JavaScript
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: '/node_modules/'
      },
      // Fonts
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        loader: 'file-loader',
        options: { name: 'fonts/[name].[ext]' }
      },
      // Images
      {
        test: /\.(gif|jpg|png|svg)$/,
        loader: 'file-loader',
        options: { name: 'img/[name].[ext]' }
      },
      // Sass
      {
        test: /\.s[ac]ss$/,
        use: styleLoader('sass-loader')
      },
      // Css
      {
        test: /\.css$/,
        use: styleLoader()
      }
    ]
  },
  devServer: {
    overlay: true,
    port: 8081
  },
};
