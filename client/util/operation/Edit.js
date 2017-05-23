import NodeOperation from './NodeOperation'
import { CURSOR_MOVE_EVENT, CURSOR_AUTO_EVENT, GUI_UPDATE_EVENT } from './OperationProxy'
import * as THREE from 'three'

export default class Edit extends NodeOperation {

  constructor (proxy,swc) {
    super(proxy,swc)
    this.mode = 'drag'
    this.target = null
  }

  /**
   *
   * @param {Array.<String>} src
   * @return {NodeOperation}
   */
  from (src) {
    this.target = this.swc.getNodeByIndex(parseInt(src[1]))
    let position = src[2].slice(1, src[2].length - 1).split(',')
    this.oldPosition = this.target.position.clone()
    this.oldRadius = this.target.radius
    this.newPosition = new THREE.Vector3(parseFloat(position[0]), parseFloat(position[1]), parseFloat(position[2]))
    this.newRadius = parseFloat(src[3])
    return this
  }

  /**
   *
   * @param {HatuNode} node
   */
  dragStart (node) {
    this.swc=node.swc
    this.target = node
    this.getProxy().setNode(this.target)
    this.oldPosition = this.target.position.clone()
    this.oldRadius = this.target.radius

    this.newPosition = this.target.position.clone()
    this.newRadius = this.target.radius

    this.getProxy().dispatchEvent({ type: CURSOR_MOVE_EVENT })
  }

  /**
   *
   * @param {HatuNode} node
   * @param {Vector3} position
   */
  drag (node, position) {
    node.position.copy(position)
    node.adjust()
    this.getProxy().dispatchEvent({ type: GUI_UPDATE_EVENT })
  }

  /**
   *
   * @param {HatuNode} node
   */
  dragEnd (node) {
    this.getProxy().setNode(node)
    this.getProxy().dispatchEvent({ type: CURSOR_AUTO_EVENT })
    this.newPosition.copy(node.position)
    this.getProxy().conduct(this)
  }

  edit () {
    if (!this.target) this.target = this.getProxy().getNode()
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
    this.getProxy().conduct(this)
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
    return `Edit ${this.target.index} (${this.newPosition.x.toFixed(4)},${this.newPosition.y.toFixed(4)},${this.newPosition.z.toFixed(4)}) ${this.newRadius.toFixed(4)}`
  }

  /**
   *
   * @param {NodeOperation} op
   */
  match (op) {
    if (op instanceof Edit) {
      return this.target.index === op.target.index && this.newPosition.distanceTo(op.newPosition) < 1 && Math.pow(this.newRadius - op.newRadius, 2) < 1
    } else {
      return false
    }
  }
}
