import express from 'express'
import path from 'path'
import proxy from 'http-proxy-middleware'
import bodyParser from 'body-parser'
import passport from 'passport'
import session from 'express-session'
import webpackConfigure from './webpackConfigure'

import userRouterGenerator from './database/user_info'
import imageRouterGenerator from './database/image_info'

import { dvidAddress, setupDvid } from './dvid'

const app = express()
webpackConfigure(app)

app.use(require('cookie-parser')())
app.use(require('body-parser').urlencoded({ extended: true }))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(session({
  secret: 'bGlseXBhZGJvYXJkdHVyYmluZQ==',
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())

function getProxyOption (uuid) {
  return proxy({
    target: dvidAddress,
    pathRewrite: {
      '^/api': '/api/node/' + uuid + '/'
    }
  })
}

async function setupRoute () {
  const uuid = await setupDvid()
  const userRoute = await userRouterGenerator()
  const imageRoute = await imageRouterGenerator()

  app.use('/users', userRoute)
  app.use('/api', imageRoute)
  app.use('/api', getProxyOption(uuid))
  app.use('/uuid', (req, res) => res.send(uuid))
  app.use('/assets/static', express.static(path.join(__dirname, '..', 'public')))
  app.use('/*', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'index.html')))
}

setupRoute()

const secretRoutes = [
  '/api',
  '/uuid',
  '/assets'
]
app.use(secretRoutes, (req, res, next) => {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.status(401).json({ messages: ['please login'] })
  }
})

const redirectRoutes = [
  '/'
]
app.get(redirectRoutes, (req, res, next) => {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.status(401).redirect('/login')
  }
})
export default app
