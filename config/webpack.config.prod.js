const { common, concatArrayCustomizer } = require('./webpack.config.common')
const _ = require('lodash')
const webpack = require('webpack')

module.exports = _.mergeWith({}, common, {
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    // TODO:disable UglifyJs to bypass SyntaxError: Unexpected token: keyword (const) [main.js:153,11] in build
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false
    //   },
    //   output: {
    //     comments: false
    //   },
    //   sourceMap: false
    // }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ]
}, concatArrayCustomizer)
