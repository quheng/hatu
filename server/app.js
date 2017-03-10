import express from 'express'
import path from 'path'
import proxy from 'http-proxy-middleware'
import bodyParser from 'body-parser'
import webpackConfigure from './webpackConfigure'

import { dvidAddress, setupDvid } from './dvid'
import { checkDatabase } from './database'
import { userRouter } from './users'
import { imageHandler } from './image'

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
  checkDatabase()
  app.use('/users', userRouter)
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
