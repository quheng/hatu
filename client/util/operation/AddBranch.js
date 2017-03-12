import NodeOperation from './NodeOperation'

export default class AddBranch extends NodeOperation {

  /**
   *
   * @param {HatuNode} node
   */
  dragStart (node) {
    this.proxy.setNode(node)
  }

  /**
   *
   * @param position
   */
  clickNothing (position) {
    if (this.proxy.getNode()) {
      this.position = position
      this.proxy.conduct(this)
    }
  }

  conduct () {
    let node=this.proxy.getNode()
    this.target = node.swc.addBranch(node, this.position)
  }

  cancel () {
    this.target.swc.undoAddBranch(this.target)
  }

  deactivate () {

  }

  uninstall () {

  }

}
