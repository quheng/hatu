import * as THREE from 'three'

export default class HatuOrthographicCamera extends THREE.OrthographicCamera {

  constructor (boundingBox, far, position, viewer) {
    let width = boundingBox.xmax - boundingBox.xmin
    let height = boundingBox.ymax - boundingBox.ymin
    if (width / height > viewer.WIDTH / viewer.HEIGHT) {
      height = width / viewer.WIDTH * viewer.HEIGHT
    } else {
      width = height / viewer.HEIGHT * viewer.WIDTH
    }

    super(width / -2, width / 2, height / 2, height / -2, 1, far)
    this.viewer = viewer
    this.position.copy(position)
    this.maxFar = far
  }

  reset () {
    this.near = 1
    this.far = this.maxFar
    this.updateProjectionMatrix()
  }

  set (elevation) {
    let basis = this.position.z - elevation + this.viewer.slices.maxElevation / 2
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

}
