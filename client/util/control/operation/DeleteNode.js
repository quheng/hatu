import NodeOperation from './NodeOperation'

export default class DeleteNode extends NodeOperation {

  /**
   *
   * @param {HatuNode} node
   */
  dragStart (node) {
    if (node.isRoot) {
      window.alert('The root node couldn\'t be deleted!')
    } else {
      this.node = node
      this.gui.viewer.operationProxy.conduct(this)
    }
  }

  conduct () {
    this.gui.viewer.swc.deleteNode(this.node)
    this.gui.setupOperation()
  }

  cancel () {
    this.gui.viewer.swc.undoDeleteNode(this.node)
  }

}
