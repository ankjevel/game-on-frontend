class Config {
  constructor() {
    const config = require('@iteam/config')({
      file: `${__dirname}/../config.json`,
      defaults: {
        api: 'http://localhost:5555',
      },
    })

    this.config = Buffer.from(
      JSON.stringify({
        api: config.get('api'),
      })
    )

    this.filepath = 'js/config.json'
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
