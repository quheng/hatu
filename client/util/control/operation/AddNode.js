import NodeOperation from './NodeOperation'

export default class AddNode extends NodeOperation {

  activate () {
    this.gui.viewer.dragControls.mode = 'edge'
  }

  /**
   *
   * @param {HatuEdge} edge
   */
  dragStart (edge) {
    this.edge = edge
    this.gui.viewer.operationProxy.conduct(this)
  }

  conduct () {
    this.node = this.gui.viewer.neuronRenderer.addNode(this.edge)
    this.gui.setupOperation()
  }

  cancel () {
    this.gui.viewer.neuronRenderer.undoAddNode(this.node)
  }

}
