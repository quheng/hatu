import * as THREE from 'three'
export default class Slices {

  constructor (width, height, elevation) {
    let geometry = new THREE.PlaneGeometry(width, height)
    let material = new THREE.MeshBasicMaterial({
      color: 0x0
    })
    this.mesh = new THREE.Mesh(geometry, material)
    this.width = width
    this.height = height
    this.elevation = 0
    this.maxElevation = elevation
    this.mesh.position.set(0, 0, 0)
    this.left = 0
    this.right = this.width
    this.top = this.height
    this.bottom = 0
    this.updateElevation = false

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
        this.mesh.position.set((right + left) / 2 - scope.viewer.center[0], (top + bottom) / 2 - scope.viewer.center[1], scope.elevation - scope.maxElevation / 2)
      }
    }
  }

  setElevation (value) {
    this.elevation = value
    this.updateElevation = true
  }

  get object () {
    return this.mesh
  }

}
