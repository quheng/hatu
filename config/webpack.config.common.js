const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const TransferPlugin = require('transfer-webpack-plugin')
const _ = require('lodash')
const ROOT = path.join(__dirname, '..')
const CLIENT = path.join(ROOT, 'client')

function concatArrayCustomizer (objValue, srcValue) {
  if (_.isArray(objValue) && _.isArray(srcValue)) {
    return objValue.concat(srcValue)
  }
}

const common = {
  context: CLIENT,
  entry: {
    main: CLIENT,
    vendor: [
      'moment',
      'redux',
      'react',
      'lodash',
      'reselect',
      'react-dom',
      'redux-saga',
      'react-redux',
      'react-router',
      'react-decoration',
      'react-addons-perf'
    ]
  },
  node: {
    fs: 'empty'
  },
  externals: [
    { './cptable': 'var cptable' },
    { './jszip': 'jszip' }
  ],
  output: {
    path: path.join(ROOT, 'public'),
    filename: '[name].js',
    publicPath: '/assets/static/'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      'node_modules'
    ]
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: CLIENT,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        include: CLIENT,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: [
            'css-loader',
            'postcss'
          ]
        })
      },
      {
        test: /\.css$/,
        include: path.join(ROOT, 'node_modules'),
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.png$/,
        loader: 'url-loader?limit=100000'
      },
      {
        test: /\.jpg$/,
        loader: 'file-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('bundle.css'),
    new TransferPlugin(
      [
        { from: 'assets', to: '' }
      ],
      path.join(__dirname, '..', 'server')
    ),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [
          require('precss'),
          require('autoprefixer')
        ]
      }
    })
  ]
}

module.exports = {
  CLIENT,
  common,
  concatArrayCustomizer
}
