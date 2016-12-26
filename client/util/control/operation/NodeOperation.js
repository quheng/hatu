export default class NodeOperation {

  /**
   *
   * @param {HatuGUI} gui
   */
  constructor (gui) {
    this.gui = gui
  }

  activate () {
    this.gui.viewer.dragControls.mode = 'node'
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
    this.gui.dom.style.cursor = 'pointer'
  }

  /**
   *
   * @param object
   */
  hoverOff (object) {
    this.gui.dom.style.cursor = 'auto'
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
    this.gui.resetNode()
  }
}
