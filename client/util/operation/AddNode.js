import NodeOperation from "./NodeOperation"
import { DRAG_EDGE_MODE_EVENT } from "./OperationProxy"

export default class AddNode extends NodeOperation {

  activate () {
    this.proxy.dispatchEvent({ type: DRAG_EDGE_MODE_EVENT })
  }

  /**
   *
   * @param {HatuCylinder} edge
   */
  dragStart (edge) {
    this.edge = edge.edge
    this.proxy.conduct(this)
  }

  conduct () {
    this.node = this.edge.swc.addNode(this.edge)
  }

  cancel () {
    this.node.swc.undoAddNode(this.node)
  }

}
