import fetch from 'isomorphic-fetch'
import express from 'express'

export default async function () {
  const router = express.Router()
  router.get('/trace/proxy/:name', handler)

  async function handler (req, res) {
    let url = `http://10.214.0.195:2222/api/swc/trace/${req.params.name}?x=${req.query.x}&y=${req.query.y}&z=${req.query.z}`
    let response = await fetch(url)
    let buffer = await response.buffer()
    res.write(buffer.toString())
    res.end()
  }

  return router
}
