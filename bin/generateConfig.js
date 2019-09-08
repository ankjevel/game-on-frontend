const { join } = require('path')
const { writeFileSync } = require('fs')
const Config = require('../lib/Config')

const {
  argv: [, , dist = 'dist'],
} = process

const config = new Config()

writeFileSync(join(process.cwd(), dist, config.filepath), config.config, {
  encoding: 'utf8',
})
