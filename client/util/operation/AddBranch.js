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
      this.newPosition = position
      this.proxy.conduct(this)
    }
  }

  conduct () {
    this.parent = this.proxy.getNode()
    let swc = this.parent.swc
    swc.pushOp(this)
    this.target = swc.addBranch(this.parent, this.newPosition)
    this.newRadius = this.target.radius
  }

  cancel () {
    let swc = this.target.swc
    swc.popOp()
    swc.undoAddBranch(this.target)
  }

  deactivate () {

  }

  uninstall () {

  }

}
