import express from 'express'
import path from 'path'
import webpackConfigure from './webpackConfigure'
import proxy from 'http-proxy-middleware'
import { dvidAddress, setupDvid } from './dvid'

const app = express()
webpackConfigure(app)

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
  app.use('/api', getProxyOption(uuid))
  app.use('/uuid', (req, res) => res.send(uuid))
  app.use('/assets/static', express.static(path.join(__dirname, '..', 'public')))
  app.use('/*', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'index.html')))
}

setupRoute()

export default app
