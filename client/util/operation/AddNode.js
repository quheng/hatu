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
    let child = edge.edge.node
    this.parent = edge.edge.nodeParent
    this.children.push(child)
    this.swc = child.swc
    this.newPosition = child.position.clone().add(this.parent.position).divideScalar(2)
    this.swc.lastIndex += 1
    this.index = this.swc.lastIndex
    this.newRadius = this.swc.avgRad
    this.proxy.conduct(this)
  }

}
