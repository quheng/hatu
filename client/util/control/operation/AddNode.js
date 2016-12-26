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
    this.gui.viewer.neuronRenderer.addNode(edge)
  }

}
