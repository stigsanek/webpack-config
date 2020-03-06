const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isDev = process.env.NODE_ENV === 'development';

// Plugins function
const applyPlugins = () => {
  return [
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
        collapseWhitespace: !isDev
      }
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css'
    })
  ];
};

// Styles function
const runStyleLoader = param => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: isDev,
        reloadAll: true,
        publicPath: '../'
      }
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
  devtool: isDev ? 'source-map' : '',
  plugins: applyPlugins(),
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
        use: runStyleLoader('sass-loader')
      },
      // Css
      {
        test: /\.css$/,
        use: runStyleLoader()
      }
    ]
  },
  devServer: {
    hot: isDev,
    overlay: true,
    port: 8081,
  },
};
