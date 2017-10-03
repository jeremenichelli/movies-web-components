const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const env = process.env.NODE_ENV;

const baseConfig = {
  entry: {
    index: './src/components/movies-app/movies-app.js'
  },
  output: {
    path: path.resolve('./static'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          {
            loader: 'css-loader',
            options: {
              minimize: true,
              modules: true,
              sourceMap: env === 'development',
              localIdentName: '[folder]-[hash:base64:5]'
            }
          },
          { loader: 'less-loader' }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.ejs',
      inject: false
    })
  ]
};

if (env === 'development') {
  baseConfig.devtool = 'source-map';
}

module.exports = baseConfig;
