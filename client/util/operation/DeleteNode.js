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
      this.proxy.conduct(this)
    }
  }

  conduct () {
    this.node.swc.deleteNode(this.node)
  }

  cancel () {
    this.node.swc.undoDeleteNode(this.node)
  }

}
