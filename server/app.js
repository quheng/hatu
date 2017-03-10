import express from 'express'
import path from 'path'
import webpackConfigure from './webpackConfigure'
import proxy from 'http-proxy-middleware'

import passport from 'passport'
import { dvidAddress, setupDvid } from './dvid'
import { checkDatabase } from './database'
import { userRouter } from './users'
import { imageHandler } from './image'
import { insert, select } from './dbTest'

const app = express()

webpackConfigure(app)

app.use(require('cookie-parser')())
app.use(require('body-parser').urlencoded({ extended: true }))
app.use(require('express-session')({ secret: 'asdfasdfasdfqlfjqwklejfnjqqjnvjqli', resave: false, saveUninitialized: false }))

app.use(passport.initialize())
app.use(passport.session())

function getProxyOption (uuid) {
  return proxy({
    target: dvidAddress,
    changeOrigin: true,
    pathRewrite: {
      '^/api': '/api/node/' + uuid + '/'
    }
  })
}
//
// app.post('/login',
//   passport.authenticate('local'),
//   function(req, res) {
//     // If this function gets called, authentication was successful.
//     // `req.user` contains the authenticated user.
//     res.redirect('/users/' + req.user.username);
//   });

//
// app.post('/login',
//   passport.authenticate('local'),
//   function(req, res) {
//     // If this function gets called, authentication was successful.
//     // `req.user` contains the authenticated user.
//     res.redirect('/users/' + req.user.username);
//   });

async function setupRoute () {
  const uuid = await setupDvid()
<<<<<<< HEAD
  checkDatabase()
  app.use('/users', userRouter)
=======
  console.log('pg test: select from hangzhou')
  insert('hangzhou', '1', '13', '7.2')
  console.log(await select('hangzhou'))
  app.get('/image', imageHandler)
>>>>>>> 9f7cb0a2540b3434f7abb058648f07e1b1905a52
  app.use('/api', getProxyOption(uuid))
  app.use('/uuid', (req, res) => res.send(uuid))
  app.use('/assets/static', express.static(path.join(__dirname, '..', 'public')))
  app.use('/*', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'index.html')))
}

setupRoute()

export default app
