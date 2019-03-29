const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

module.exports =  {
  entry: [
    './src/client.js',
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader"
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      }
    ]
  },
  output: {
    path: path.resolve(process.cwd(), 'build'),
    publicPath: '/',
    filename: 'client.js'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "main.css",
      chunkFilesname: "[id].css",
    }),
    new webpack.DefinePlugin({
      'process.env.BROWSER': true,
      'process.env.SERVER': false,
    }),
  ],
  stats: 'minimal',
  target: 'web',
  devtool: 'source-map',
  mode: 'development',
}
