import HatuCylinder from './HatuCylinder'
import HatuSkeleton from './HatuSkeleton'

export default class HatuEdge {

  /**
   *
   * @param {HatuNode} node
   * @param {HatuNode} nodeParent
   */
  constructor (node, nodeParent) {
    this.node = node
    this.nodeParent = nodeParent
    this.swc = node.swc
    this.cylinder = new HatuCylinder(node, nodeParent, this)
    this.skeleton = new HatuSkeleton(node, nodeParent, this)
  }

  adjust () {
    this.cylinder.adjust()
    this.skeleton.adjust()
  }

  obj (mode) {
    return this[mode]
  }
}
