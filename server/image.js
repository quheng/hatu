import ImageInstance from './image/ImageInstance'

export function imageHandler (req, res) {
  let elevation = Number(req.query.elevation)
  let left = Math.round(Number(req.query.left))
  let right = Math.round(Number(req.query.right))
  let top = Math.round(Number(req.query.top))
  let bottom = Math.round(Number(req.query.bottom))

  let imageInstance = new ImageInstance('slice15', 256)
  imageInstance.retrieve(left, right, top, bottom, elevation)
    .then(data => {
      res.writeHead(200, { 'Content-Type': 'image/jpeg' })
      res.write(data, 'binary')
      res.end()
    })
}
