import Interpolate from './Interpolate'

export default class AddBranch extends Interpolate {

  /**
   *
   * @param {HatuNode} node
   */
  dragStart (node) {
    this.swc=node.swc
    this.proxy.setNode(node)
  }

  /**
   *
   * @param {Vector3} position
   */
  clickNothing (position) {
    if (this.proxy.getNode()) {
      this.parent = this.proxy.getNode()
      this.swc = this.parent.swc
      this.newPosition = position
      this.swc.lastIndex += 1
      this.index = this.swc.lastIndex
      this.newRadius = this.swc.avgRad
      this.proxy.conduct(this)
    }
  }

  deactivate () {

  }

  uninstall () {

  }

}
