import express from 'express'
import path from 'path'
import webpackConfigure from './webpackConfigure'
import setupDvid from './dvid'

const app = express()
webpackConfigure(app)

async function setupRoute () {
  app.use('/api', await setupDvid())
  app.use('/assets/static', express.static(path.join(__dirname, '..', 'public')))
  app.use('/*', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'index.html')))
}

setupRoute()

export default app
