import NodeOperation from './NodeOperation'

export default class AddBranch extends NodeOperation {

  /**
   *
   * @param {HatuNode} node
   */
  dragStart (node) {
    if (this.selectedNode) {
      this.selectedNode.material.emissive.setHex(this.selectedNode.currentHex)
    }
    this.selectedNode = node

    this.selectedNode.currentHex = node.material.emissive.getHex()
    this.selectedNode.material.emissive.setHex(0xff0000)
  }

  /**
   *
   * @param position
   */
  clickNothing (position) {
    if (this.selectedNode) {
      this.position = position
      this.gui.viewer.operationProxy.conduct(this)
    }
  }

  conduct () {
    this.node = this.gui.viewer.neuronRenderer.addBranch(this.selectedNode, this.position)
    this.gui.setupOperation()
  }

  cancel () {
    this.gui.viewer.neuronRenderer.undoAddBranch(this.node)
  }

  deactivate () {
    super.deactivate()
    if (this.selectedNode) {
      this.selectedNode.material.emissive.setHex(this.selectedNode.currentHex)
    }
  }

}
