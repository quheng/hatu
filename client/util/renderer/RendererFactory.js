import SkeletonRenderer from './SkeletonRenderer'
import SphereRenderer from './SphereRenderer'

export default class RendererFactory {
  constructor (viewer) {
    this.viewer = viewer
  }

  create (name) {
    let renderer
    switch (name) {
      case 'skeleton':
        renderer = new SkeletonRenderer(this.viewer)
        break
      case 'sphere':
        renderer = new SphereRenderer(this.viewer)
        break
    }
    renderer.setPosition(-this.viewer.center[0], -this.viewer.center[1], -this.viewer.center[2])
    return renderer
  }
}
