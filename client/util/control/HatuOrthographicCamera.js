import * as THREE from 'three'

export default class HatuOrthographicCamera extends THREE.OrthographicCamera {

  /**
   *
   * @param {HatuViewer} viewer
   */
  constructor (viewer) {
    super(0, 1, 0, 1, 1, 2)
    this.viewer = viewer
    this.update()
  }

  reset () {
    this.near = 1
    this.far = this.maxFar
    this.updateProjectionMatrix()
  }

  set (elevation) {
    if (!this.viewer.supervisor) {
      return
    }
    let basis = this.position.z - elevation + this.viewer.supervisor.getSlice().maxElevation / 2
    this.near = basis - 1
    this.far = basis + 1
    this.updateProjectionMatrix()
  }

  orthographicZoom (factor) {
    this.left = this.left * factor
    this.right = this.right * factor
    this.top = this.top * factor
    this.bottom = this.bottom * factor

    this.updateProjectionMatrix()
  }

  update () {
    let width = this.viewer.boundingBox.xmax - this.viewer.boundingBox.xmin
    let height = this.viewer.boundingBox.ymax - this.viewer.boundingBox.ymin
    if (width / height > this.viewer.WIDTH / this.viewer.HEIGHT) {
      height = width / this.viewer.WIDTH * this.viewer.HEIGHT
    } else {
      width = height / this.viewer.HEIGHT * this.viewer.WIDTH
    }
    let far = (this.viewer.boundingBox.zmax * 2 + 1000) * 5
    this.left = width / -2
    this.right = width / 2
    this.top = height / 2
    this.bottom = height / -2
    this.near = 1
    this.far = far
    this.maxFar = far
    this.position.setZ(this.viewer.boundingBox.zmax * 2 + 1000)
    this.updateProjectionMatrix()
  }

}
