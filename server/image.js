import sharp from 'sharp'

import NodeCache from 'node-cache'
const imageCache = new NodeCache({ stdTTL: 100, checkperiod: 120 })

const MAX_AREA = 512 * 512

export function imageHandler (req, res) {
  let elevation = Number(req.query.elevation)
  let left = Math.round(Number(req.query.left))
  let right = Math.round(Number(req.query.right))
  let top = Math.round(Number(req.query.top))
  let bottom = Math.round(Number(req.query.bottom))

  console.log(`(${left},${right},${top},${bottom})`)

  let name = `/image/slice15_L11_p${elevation}.jpg`
  let value = imageCache.get(name)
  if (value === undefined) {
    value = sharp(name).flop()
    imageCache.set(name, value)
  }

  let width = right - left
  let height = bottom - top
  value.extract({
    left: left,
    top: top,
    width: width,
    height: height
  })

  let mArea = width * height
  if (mArea > MAX_AREA) {
    let ratio = Math.sqrt(mArea / MAX_AREA)
    console.log(`${width},${height}`)
    console.log(ratio)
    value.resize(Math.round(width / ratio), Math.round(height / ratio))
  }

  // value.resize(512, 512)

  value.toBuffer().then(data => {
    res.writeHead(200, { 'Content-Type': 'image/jpeg' })
    res.write(data, 'binary')
    res.end()
  })
}
