import express from 'express'
import path from 'path'
import proxy from 'http-proxy-middleware'
import bodyParser from 'body-parser'
import webpackConfigure from './webpackConfigure'
import database from './database'

import { dvidAddress, setupDvid } from './dvid'
import userRouterGenerator from './users'
import { imageHandler } from './image'

database
  .authenticate()
  .then(function () {
    console.log('Connection has been established successfully.')
  })
  .catch(function (err) {
    console.log('Unable to connect to the database:', err)
    process.exit(-1)
  })

const app = express()
webpackConfigure(app)

app.use(require('cookie-parser')())
app.use(require('body-parser').urlencoded({ extended: true }))
app.use(require('express-session')({ secret: 'asdfasdfasdfqlfjqwklejfnjqqjnvjqli', resave: false, saveUninitialized: false }))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

function getProxyOption (uuid) {
  return proxy({
    target: dvidAddress,
    changeOrigin: true,
    pathRewrite: {
      '^/api': '/api/node/' + uuid + '/'
    }
  })
}

async function setupRoute () {
  const uuid = await setupDvid()
  const userRoute = await userRouterGenerator(database)
  app.use('/users', userRoute)
  app.get('/image', imageHandler)
  app.use('/api', getProxyOption(uuid))
  app.use('/uuid', (req, res) => res.send(uuid))
  app.use('/assets/static', express.static(path.join(__dirname, '..', 'public')))
  app.use('/*', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'index.html')))
}

setupRoute()

const secretRoute = [
  '/api',
  '/image',
  '/uuid',
  '/assets'
]
app.use(secretRoute, (req, res, next) => {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.status(401).json({ messages: ['please login'] })
  }
})

export default app
