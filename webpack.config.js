const path = require('path')
const Config = require('./lib/Config')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const outputDir = path.join(__dirname, 'dist/')
const configPlugin = new Config({})
const config = configPlugin.serverConfig

module.exports = {
  mode: config.mode,
  optimization: {
    usedExports: true,
  },
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
    contentBase: path.join(__dirname, 'public/'),
    compress: true,
    ...config.devServer,
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader',
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: { importLoaders: 1 },
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                require('postcss-nested'),
                require('tailwindcss'),
                require('autoprefixer'),
              ],
            },
          },
        ],
      },
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        loaders: ['babel-loader', 'ts-loader'],
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
        exclude: [path.join(process.cwd(), 'node_modules')],
      },
    ],
  },
}
