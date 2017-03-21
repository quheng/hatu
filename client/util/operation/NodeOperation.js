import { DRAG_NODE_MODE_EVENT, CURSOR_POINTER_EVENT, CURSOR_AUTO_EVENT } from './OperationProxy'

export default class NodeOperation {

  /**
   *
   * @param {OperationProxy} proxy
   */

  constructor (proxy) {
    this.proxy = proxy
  }

  activate () {
    this.proxy.dispatchEvent({ type: DRAG_NODE_MODE_EVENT })
  }

  /**
   *
   * @param {HatuNode} node
   * @param {Vector3} position
   */
  drag (node, position) {
  }

  /**
   *
   * @param {HatuNode} node
   */
  hoverOn (node) {
    this.proxy.dispatchEvent({ type: CURSOR_POINTER_EVENT })
  }

  /**
   *
   * @param object
   */
  hoverOff (object) {
    this.proxy.dispatchEvent({ type: CURSOR_AUTO_EVENT })
  }

  /**
   *
   * @param object
   */
  dragStart (object) {

  }

  /**
   *
   * @param object
   */
  dragEnd (object) {

  }

  /**
   *
   * @param position
   */
  clickNothing (position) {

  }

  deactivate () {

  }

  uninstall () {

  }

  conduct () {

  }

  cancel () {
  }

}
