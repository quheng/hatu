import EditParent from './EditParent'
export default class DeleteParent extends EditParent {

  getTarget () {
    return super.getTarget()
  }
  /**
   *
   * @param {HatuNode} node
   */
  dragStart (node) {
    this.swc = node.swc
    if (node.isRoot) {
      window.alert('The root node has no parent!')
    } else {
      this.target = node
      this.proxy.setNode(node)
      this.oldParent = [this.target.parentNode]
      this.proxy.conduct(this)
    }
  }
}
