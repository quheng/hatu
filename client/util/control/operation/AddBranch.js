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
      this.gui.viewer.neuronRenderer.addBranch(this.selectedNode, position)
    }
  }

  deactivate () {
    super.deactivate()
    if (this.selectedNode) {
      this.selectedNode.material.emissive.setHex(this.selectedNode.currentHex)
    }
  }

}
