import NodeOperation from "./NodeOperation"
import { CHOOSE_BOX_OPEN, CHOOSE_BOX_CLOSE, CHOOSE_BOX_UPDATE, TRACE_BOX_OPEN, TRACE_BOX_CLOSE } from "./OperationProxy"

export default class Trace extends NodeOperation {

  /**
   *
   * @param {OperationProxy} proxy
   * @param {Swc} swc
   */
  constructor (proxy, swc) {
    super(proxy, swc)
    this.count = 0
    this.left = 0
    this.right = 0
    this.top = 0
    this.bottom = 0
    this.near = 0
    this.far = 0
  }

  /**
   *
   * @param {Vector3} position
   */
  clickNothing (position) {
    if (this.count === 0) {
      this.count++
      this.position1 = position
      this.getProxy().dispatchEvent({ type: CHOOSE_BOX_OPEN })
    } else if (this.count === 1) {
      this.count++
      this.position2 = position
      this.calculateArea()
      this.getProxy().dispatchEvent({ type: TRACE_BOX_OPEN, trace: this })
    }
  }


  /**
   *
   * @param {Vector3} position
   */
  move (position) {
    if (this.count === 1) {
      this.getProxy().dispatchEvent({ type: CHOOSE_BOX_UPDATE, position1: this.position1, position2: position })
    }
  }

  calculateArea () {
    if (this.position1.x < this.position2.x) {
      this.left = this.position1.x
      this.right = this.position2.x
    } else {
      this.right = this.position1.x
      this.left = this.position2.x
    }

    if (this.position1.y > this.position2.y) {
      this.top = this.position1.y
      this.bottom = this.position2.y
    } else {
      this.bottom = this.position1.y
      this.top = this.position2.y
    }
  }

  yes () {
    if (this.left < this.right && this.bottom < this.top && this.near < this.far) {
      this.getProxy().dispatchEvent({ type: CHOOSE_BOX_CLOSE })
      this.getProxy().dispatchEvent({ type: TRACE_BOX_CLOSE, trace: this })
      this.getProxy().conduct(this)
      this.count = 0
    } else {
      if (window) {
        window.alert('illegal parameter')
      }
    }
  }

  no () {
    this.getProxy().dispatchEvent({ type: CHOOSE_BOX_CLOSE })
    this.getProxy().dispatchEvent({ type: TRACE_BOX_CLOSE, trace: this })
    this.count = 0
  }

  conduct () {

  }

  cancel () {

  }

}