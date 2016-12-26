const {
  CLIENT,
  common,
  concatArrayCustomizer
} = require('./webpack.config.common')
const _ = require('lodash')
const webpack = require('webpack')

module.exports = _.mergeWith({}, common, {
  devtool: 'source-map',
  entry: {
    main: [
      'webpack-hot-middleware/client',
      CLIENT
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('dev')
      }
    })
  ]
}, concatArrayCustomizer)
