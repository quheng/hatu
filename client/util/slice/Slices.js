import * as THREE from 'three'
import PolicyManager from './PolicyManager'

const textureLoader = new THREE.TextureLoader()
const emptyMaterial = new THREE.MeshBasicMaterial({
  color: 0x0
})

export default class Slices {

  constructor (width, height, elevation) {
    this.viewer = null
    this.width = width
    this.height = height
    this.elevation = 0
    this.maxElevation = elevation
    this.left = 0
    this.right = this.width
    this.top = this.height
    this.bottom = 0
    this.policyManager = new PolicyManager(this)
    let geometry = new THREE.PlaneGeometry(width, height)
    this.mesh = new THREE.Mesh(geometry, this.getMaterial())
    this.updateElevation = false
    this.mesh.position.set(0, 0, 0)

    let scope = this

    this.notify = () => {
      let window = scope.viewer.getWindow()
      scope.left = Math.max(window.left, 0)
      scope.right = Math.min(window.right, scope.width)
      scope.top = Math.min(window.top, scope.height)
      scope.bottom = Math.max(window.bottom, 0)

      scope.policyManager.notify()
      scope.updatePosition()
    }
  }

  update () {
    this.mesh.material = this.getMaterial()
  }

  updatePosition () {
    this.mesh.geometry = new THREE.PlaneGeometry(this.right - this.left, this.top - this.bottom)
    this.mesh.position.set((this.right + this.left) / 2 - this.viewer.center[0], (this.top + this.bottom) / 2 - this.viewer.center[1], this.elevation - this.maxElevation / 2)
    this.mesh.material = emptyMaterial
  }

  getMaterial () {
    let url = `/image?elevation=${this.elevation}&left=${this.left}&right=${this.right}&top=${this.bottom}&bottom=${this.top}`
    console.log(url)
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
