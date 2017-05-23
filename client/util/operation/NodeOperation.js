import { DRAG_NODE_MODE_EVENT, CURSOR_POINTER_EVENT, CURSOR_AUTO_EVENT } from './OperationProxy'

export default class NodeOperation {

  /**
   *
   * @param {OperationProxy} proxy
   * @param {Swc} swc
   */
  constructor (proxy, swc) {
    this.proxy = proxy
    this.swc = swc
    this.target = null
  }

  /**
   *
   * @param {Array.<String>} src
   * @return {NodeOperation}
   */
  from (src) {

  }

  /**
   *
   * @return {HatuNode}
   */
  getTarget () {
    return this.target
  }

  /**
   *
   * @return {OperationProxy}
   */
  getProxy(){
    return this.proxy
  }

  activate () {
    this.getProxy().dispatchEvent({ type: DRAG_NODE_MODE_EVENT })
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
   * @param {Vector3} position
   */
  clickNothing (position) {

  }

  /**
   *
   * @param {Vector3} position
   */
  move (position){

  }

  deactivate () {

  }

  uninstall () {

  }

  conduct () {

  }

  cancel () {
  }

  /**
   *
   * @return {string}
   */
  toString () {
    return ''
  }

  /**
   *
   * @param {NodeOperation} op
   */
  match (op) {
    return false
  }

  /**
   *
   * @param {NodeOperation} l
   * @return {boolean}
   */
  equal (l) {
    return this.toString() === l.toString()
  }
}
