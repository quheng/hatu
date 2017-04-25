import NodeOperation from './NodeOperation'
import { CURSOR_MOVE_EVENT, CURSOR_AUTO_EVENT, GUI_UPDATE_EVENT } from './OperationProxy'

export default class Edit extends NodeOperation {

  constructor (proxy) {
    super(proxy)
    this.mode = 'drag'
    this.target = null
  }

  /**
   *
   * @param {HatuNode} node
   */
  dragStart (node) {
    this.target = node
    this.proxy.setNode(this.target)
    this.oldPosition = this.target.position.clone()
    this.oldRadius = this.target.radius

    this.newPosition = this.target.position.clone()
    this.newRadius = this.target.radius

    this.proxy.dispatchEvent({ type: CURSOR_MOVE_EVENT })
  }

  /**
   *
   * @param {HatuNode} node
   * @param {Vector3} position
   */
  drag (node, position) {
    node.position.copy(position)
    node.adjust()
    this.proxy.dispatchEvent({ type: GUI_UPDATE_EVENT })
  }

  /**
   *
   * @param {HatuNode} node
   */
  dragEnd (node) {
    this.proxy.setNode(node)
    this.proxy.dispatchEvent({ type: CURSOR_AUTO_EVENT })
    this.newPosition.copy(node.position)
    this.proxy.conduct(this)
  }

  edit () {
    if (!this.target) this.target = this.proxy.getNode()
    this.oldPosition = this.target.position.clone()
    this.oldRadius = this.target.radius

    switch (this.mode) {
      case 'radius':
        this.oldRadius = this.target.radius
        this.target.radius = this.radius
        break
      case 'x':
        this.target.x = this.x
        break
      case 'y':
        this.target.y = this.y
        break
      case 'z':
        this.target.z = this.z
        break
    }

    this.newPosition = this.target.position.clone()
    this.newRadius = this.target.radius
    this.proxy.conduct(this)
  }

  conduct () {
    this.target.position.copy(this.newPosition)
    this.target.radius = this.newRadius
    this.target.adjust()

    let swc = this.target.swc
    swc.pushOp(this)
    swc.update(this.target, this.oldPosition)
  }

  cancel () {
    if (!this.target) {
      return
    }

    this.target.position.copy(this.oldPosition)
    this.target.radius = this.oldRadius

    this.target.adjust()
    let swc = this.target.swc
    swc.popOp()
    swc.update(this.target, this.newPosition)
  }

  deactivate () {

  }

  uninstall () {

  }

  toString () {
    return `Edit(${this.target.index},${this.newPosition.x},${this.newPosition.y},${this.newPosition.z},${this.newRadius})`
  }

}
