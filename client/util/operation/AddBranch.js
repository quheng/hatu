import Interpolate from './Interpolate'

export default class AddBranch extends Interpolate {

  /**
   *
   * @param {HatuNode} node
   */
  dragStart (node) {
    this.proxy.setNode(node)
  }

  /**
   *
   * @param {Vector3} position
   */
  clickNothing (position) {
    if (this.proxy.getNode()) {
      this.parent = this.proxy.getNode()
      let swc = this.parent.swc
      this.newPosition = position
      swc.lastIndex += 1
      this.index = swc.lastIndex
      this.newRadius = swc.avgRad
      this.proxy.conduct(this)
    }
  }

  deactivate () {

  }

  uninstall () {

  }

}
