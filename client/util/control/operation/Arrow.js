import NodeOperation from './NodeOperation'

export default class Arrow extends NodeOperation {

  /**
   *
   * @param {HatuNode} node
   */
  dragStart (node) {
    this.gui.node = node
    this.oldPosition = node.position.clone()
    this.target = node
    this.gui.dom.style.cursor = 'move'
  }

  /**
   *
   * @param {HatuNode} node
   * @param {Vector3} position
   */
  drag (node, position) {
    node.position.copy(position)

    node.adjust()
    this.gui.node = node
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
    this.target.position.copy(this.newPosition)
    this.target.adjust()
    this.gui.setupOperation()
  }

  cancel () {
    this.target.position.copy(this.oldPosition)
    this.target.adjust()
  }

  deactivate () {

  }

  uninstall () {

  }
}
