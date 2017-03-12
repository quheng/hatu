import NodeOperation from './NodeOperation'
import { CURSOR_MOVE_EVENT, CURSOR_AUTO_EVENT, GUI_UPDATE_EVENT } from './OperationProxy'

export default class Arrow extends NodeOperation {

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
    this.proxy.setNode(node)
    this.oldPosition = node.position.clone()
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
    this.newPosition = node.position.clone()
    this.proxy.conduct(this)
  }

  conduct () {
    if (!this.target) this.target = this.proxy.getNode()
    switch (this.mode) {
      case 'drag':
        this.target.position.copy(this.newPosition)
        break
      case 'radius':
        this.oldRadius = this.target.radius
        this.target.radius = this.radius
        break
      case 'x':
        this.oldX = this.target.x
        this.target.x = this.x
        break
      case 'y':
        this.oldY = this.target.y
        this.target.y = this.y
        break
      case 'z':
        this.oldZ = this.target.z
        this.target.z = this.z
        break
    }
    this.target.adjust()
  }

  cancel () {
    if (!this.target) {
      return
    }
    switch (this.mode) {
      case 'drag':
        this.target.position.copy(this.oldPosition)
        break
      case 'radius':
        this.target.radius = this.oldRadius
        break
      case 'x':
        this.target.position.x = this.oldX
        break
      case 'y':
        this.target.position.y = this.oldY
        break
      case 'z':
        this.target.position.z = this.oldZ
        break
    }
    this.target.adjust()
  }

  deactivate () {

  }

  uninstall () {

  }
}
