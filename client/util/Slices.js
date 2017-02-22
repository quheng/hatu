import * as THREE from 'three'

const textureLoader = new THREE.TextureLoader()

export default class Slices {

  constructor (width, height, elevation) {
    this.width = width
    this.height = height
    this.elevation = 0
    this.maxElevation = elevation
    this.left = 0
    this.right = this.width
    this.top = this.height
    this.bottom = 0
    let geometry = new THREE.PlaneGeometry(width, height)
    this.mesh = new THREE.Mesh(geometry, this.getMaterial())
    this.updateElevation = false
    this.mesh.position.set(0, 0, 0)

    let scope = this
    this.notify = () => {
      let window = scope.viewer.getWindow()
      let left = Math.max(window.left, 0)
      let right = Math.min(window.right, this.width)
      let top = Math.min(window.top, this.height)
      let bottom = Math.max(window.bottom, 0)
      let sqr = n => n * n

      if ((sqr(left - scope.left) + sqr(right - scope.right) + sqr(top - scope.top) + sqr(bottom - scope.bottom) > 1) || scope.updateElevation) {
        scope.left = left
        scope.right = right
        scope.top = top
        scope.bottom = bottom
        scope.updateElevation = false
        this.mesh.geometry = new THREE.PlaneGeometry(right - left, top - bottom)
        this.mesh.material = this.getMaterial()
        this.mesh.position.set((right + left) / 2 - scope.viewer.center[0], (top + bottom) / 2 - scope.viewer.center[1], scope.elevation - scope.maxElevation / 2)
      }
    }
  }

  getMaterial () {
    let url = `/image?elevation=${this.elevation + 1}&left=${this.width - this.right}&right=${this.width - this.left}&top=${this.height - this.top}&bottom=${this.height - this.bottom}`
    let texture = textureLoader.load(url)
    return new THREE.MeshBasicMaterial({
      map: texture
    })
  }

  setElevation (value) {
    this.elevation = value
    this.updateElevation = true
  }

  get object () {
    return this.mesh
  }

}
