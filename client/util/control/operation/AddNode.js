import NodeOperation from './NodeOperation'

export default class AddNode extends NodeOperation {

  activate () {
    this.gui.viewer.dragControls.mode = 'edge'
  }

  /**
   *
   * @param {HatuCylinder} edge
   */
  dragStart (edge) {
    this.edge = edge.edge
    this.gui.viewer.operationProxy.conduct(this)
  }

  conduct () {
    this.node = this.gui.viewer.swc.addNode(this.edge)
    this.gui.setupOperation()
  }

  cancel () {
    this.gui.viewer.swc.undoAddNode(this.node)
  }

}
