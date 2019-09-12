const path = require('path')
const Config = require('./lib/Config')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const outputDir = path.join(__dirname, 'dist/')
const configPlugin = new Config({})
const config = configPlugin.serverConfig

module.exports = {
  mode: config.mode,
  devtool: 'source-map',
  output: {
    path: outputDir,
    filename: 'index.[hash].js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html',
    }),
    configPlugin,
  ],
  entry: './src/index.tsx',
  devServer: {
    contentBase: outputDir,
    ...config.devServer,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'postcss-loader',
        ],
      },
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
      },
    ],
  },
}
