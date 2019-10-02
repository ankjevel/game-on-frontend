const path = require('path')
const Config = require('./lib/Config')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const outputDir = path.join(__dirname, 'dist/')
const configPlugin = new Config({})
const config = configPlugin.serverConfig
const dev = config.mode === 'development'

module.exports = {
  mode: config.mode,
  optimization: {
    usedExports: true,
    splitChunks: {
      chunks: 'all',
    },
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
    new MiniCssExtractPlugin({
      filename: dev ? '[name].css' : '[name].[hash].css',
      chunkFilename: dev ? '[id].css' : '[id].[hash].css',
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),
    new CopyWebpackPlugin([{ from: 'public/', to: outputDir }]),
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
            loader: MiniCssExtractPlugin.loader,
            options: { hmr: dev },
          },
          {
            loader: 'css-loader',
            options: { importLoaders: 1 },
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                require('tailwindcss'),
                require('postcss-nested'),
                ...(config.mode === 'production'
                  ? [
                      require('@fullhuman/postcss-purgecss')({
                        content: [
                          './src/**/*.tsx',
                          './src/**/*.css',
                          './src/index.css',
                        ],
                        css: ['./src/**/*.css', './src/index.css'],
                        keyframes: true,
                        whitelistPatterns: [/[ac]_[a-z0-9-_:/]+/gi],
                      }),
                      require('cssnano'),
                    ]
                  : []),
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
