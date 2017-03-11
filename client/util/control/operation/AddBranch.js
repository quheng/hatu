import NodeOperation from './NodeOperation'

export default class AddBranch extends NodeOperation {

  /**
   *
   * @param {HatuNode} node
   */
  dragStart (node) {
    this.gui.node = node
  }

  /**
   *
   * @param position
   */
  clickNothing (position) {
    if (this.gui.selectedNode) {
      this.position = position
      this.gui.viewer.operationProxy.conduct(this)
    }
  }

  conduct () {
    this.target = this.gui.viewer.swc.addBranch(this.gui.selectedNode, this.position)
    this.gui.setupOperation()
  }

  cancel () {
    this.gui.viewer.swc.undoAddBranch(this.target)
  }

  deactivate () {

  }

  uninstall () {

  }

}
