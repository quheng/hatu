import * as THREE from 'three'
import PolicyManager from './PolicyManager'

const textureLoader = new THREE.TextureLoader()
const emptyMaterial = new THREE.MeshBasicMaterial({
  color: 0x0
})

export default class Slices {

  constructor (width, height, elevation, imageName) {
    this.imageName = imageName
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
    this.calculateBoundingBox()
  }

  calculateBoundingBox () {
    const boundingBox = {
      'xmin': 0,
      'xmax': this.width,
      'ymin': 0,
      'ymax': this.height,
      'zmin': 0,
      'zmax': this.maxElevation
    }
    this.boundingBox = boundingBox
    this.center = [(boundingBox.xmax + boundingBox.xmin) / 2, (boundingBox.ymax + boundingBox.ymin) / 2, (boundingBox.zmax + boundingBox.zmin) / 2]
  }

  update () {
    this.mesh.material = this.getMaterial()
  }

  /**
   *
   * @param {HatuViewer} viewer
   */
  notify (viewer) {
    const window = viewer.getWindow()
    this.left = Math.max(window.left, 0)
    this.right = Math.min(window.right, this.width)
    this.top = Math.min(window.top, this.height)
    this.bottom = Math.max(window.bottom, 0)

    this.policyManager.notify()
    this.updatePosition(viewer.center)
  }

  updatePosition (center) {
    this.mesh.geometry = new THREE.PlaneGeometry(this.right - this.left, this.top - this.bottom)
    if (this.viewer.gui.visualMode === 'slices')
      this.mesh.position.set((this.right + this.left) / 2 - center[0], (this.top + this.bottom) / 2 - center[1], this.elevation - this.maxElevation / 2)
    else
      this.mesh.position.set((this.right + this.left) / 2 - center[0], (this.top + this.bottom) / 2 - center[1], 0 - this.maxElevation / 2)
    this.mesh.material = emptyMaterial
  }

  /**
   *
   * @return {MeshBasicMaterial}
   */
  getMaterial () {
    const url = `/api/image/${this.imageName}/?elevation=${this.elevation}&left=${this.left}&right=${this.right}&top=${this.bottom}&bottom=${this.top}`
    const texture = textureLoader.load(url)
    return new THREE.MeshBasicMaterial({
      map: texture
    })
  }

  setElevation (value) {
    this.elevation = value
    this.updateElevation = true
  }

  /**
   *
   * @return {Mesh}
   */
  get object () {
    return this.mesh
  }
}
