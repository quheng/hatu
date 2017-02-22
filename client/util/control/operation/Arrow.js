import NodeOperation from './NodeOperation'

export default class Arrow extends NodeOperation {

  /**
   *
   * @param {HatuNode} node
   */
  dragStart (node) {
    if (this.selectedNode) {
      this.selectedNode.material.emissive.setHex(this.selectedNode.currentHex)
    }
    this.gui.node = node
    this.selectedNode = node
    this.oldPosition = node.position.clone()

    this.selectedNode.currentHex = node.material.emissive.getHex()
    this.selectedNode.material.emissive.setHex(0xff0000)

    this.gui.dom.style.cursor = 'move'
  }

  /**
   *
   * @param {HatuNode} node
   * @param {Vector3} position
   */
  drag (node, position) {
    this.gui.node = node

    node.position.copy(position)
    node.adjust()
  }

  /**
   *
   * @param {HatuNode} node
   */
  dragEnd (node) {
    this.gui.node = node
    this.gui.dom.style.cursor = 'auto'
    this.newPosition = node.position.clone()
    this.gui.viewer.operationProxy.conduct(this)
  }

  conduct () {
    this.selectedNode.position.copy(this.newPosition)
    this.selectedNode.adjust()
    this.gui.setupOperation()
  }

  cancel () {
    this.selectedNode.position.copy(this.oldPosition)
    this.selectedNode.adjust()
  }

  deactivate () {
    super.deactivate()
    if (this.selectedNode) {
      this.selectedNode.material.emissive.setHex(this.selectedNode.currentHex)
    }
  }
}
