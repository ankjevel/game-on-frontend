class Config {
  constructor() {
    const config = require('@iteam/config')({
      file: `${__dirname}/../config.json`,
      defaults: {
        api: 'http://localhost:5555',
        mode: 'development', //  'production
        devServer: {
          host: '0.0.0.0',
          port: 3000,
          disableHostCheck: true,
          compress: true,
          historyApiFallback: true,
          stats: 'minimal',
        },
        filepath: 'js/config.json',
      },
    })

    this.serverConfig = {
      mode: config.get('mode'),
      devServer: config.get('devServer'),
    }

    this.config = Buffer.from(
      JSON.stringify({
        api: config.get('api'),
      })
    )

    this.filepath = config.get('filepath')
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('Config', (compilation, callback) => {
      compilation.assets[this.filepath] = {
        filepath: () => this.filepath,
        source: () => this.config,
        size: () => Buffer.byteLength(this.config, 'utf8'),
      }

      callback()
    })
  }
}

module.exports = Config
