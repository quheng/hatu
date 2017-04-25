import { DRAG_EDGE_MODE_EVENT } from './OperationProxy'
import Interpolate from './Interpolate'

export default class AddNode extends Interpolate {

  activate () {
    this.proxy.dispatchEvent({ type: DRAG_EDGE_MODE_EVENT })
  }

  /**
   *
   * @param {HatuCylinder | HatuSkeleton} edge
   */
  dragStart (edge) {
    this.edge = edge.edge
    this.proxy.conduct(this)
  }

  conduct () {
    let swc = this.edge.swc
    swc.pushOp(this)
    this.target = swc.addNode(this.edge)
    this.newPosition = this.target.position.clone()
    this.newRadius = this.target.radius
    this.parent = this.edge.nodeParent
    this.children.push(this.edge.node)
  }

  cancel () {
    let swc = this.target.swc
    swc.popOp()
    swc.undoAddNode(this.target)
  }

}
