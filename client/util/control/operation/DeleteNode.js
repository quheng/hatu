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
      this.gui.viewer.neuronRenderer.deleteNode(node)
    }
  }

}
