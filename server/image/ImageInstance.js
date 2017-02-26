import { dvidAddress, uuid } from '../dvid'
import sharp from 'sharp'
import fetch from 'isomorphic-fetch'

const MAX_AREA = 512 * 512

const min = (a, b) => a > b ? b : a
const max = (a, b) => a > b ? a : b

export default class ImageInstance {
  constructor (name, tileSize) {
    this.name = name
    this.tileSize = tileSize
  }

  async retrieve (left, right, top, bottom, elevation) {
    let width = right - left
    let height = bottom - top
    let mArea = width * height
    let ratio = 1
    if (mArea > MAX_AREA) {
      ratio = Math.sqrt(mArea / MAX_AREA)
    }

    let base = sharp(new Buffer(
      `<svg><rect width="${width / ratio}" height="${height / ratio}" style="fill:black"/></svg>`
    ))

    for (let i = parseInt(left / this.tileSize); i <= parseInt((right - 1) / this.tileSize); i++) {
      for (let j = parseInt(top / this.tileSize); j <= parseInt((bottom - 1) / this.tileSize); j++) {
        let tile = await this.fetch(i, j, elevation)
        let bounding = this.getBounding(i, j, left, right, top, bottom)
        tile.extract(bounding).resize(Math.round(bounding.width / ratio), Math.round(bounding.height / ratio))

        let buffer = await tile.toBuffer()
        base = sharp(await base.overlayWith(buffer, {
          left: Math.round((bounding.left + i * this.tileSize - left) / ratio),
          top: Math.round((bounding.top + j * this.tileSize - top) / ratio)
        }).toBuffer())
      }
    }

    return base.flip().toBuffer()
  }

  async fetch (x, y, z) {
    let url = `${dvidAddress}/api/node/${uuid}/${this.name}/tile/xy/0/${x}_${y}_${z}`
    const response = await fetch(url)

    return sharp(await response.buffer())
  }

  getBounding (i, j, left, right, top, bottom) {
    let mLeft = max(i * this.tileSize, left)
    let mTop = max(j * this.tileSize, top)
    let mRight = min((i + 1) * this.tileSize, right)
    let mBottom = min((j + 1) * this.tileSize, bottom)

    return {
      left: mLeft - i * this.tileSize,
      top: mTop - j * this.tileSize,
      width: mRight - mLeft,
      height: mBottom - mTop
    }
  }

}
