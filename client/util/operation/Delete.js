import NodeOperation from './NodeOperation'

export default class Delete extends NodeOperation {

  /**
   *
   * @param {HatuNode} node
   */
  dragStart (node) {
    if (node.isRoot) {
      window.alert('The root node couldn\'t be deleted!')
    } else {
      this.target = node
      this.proxy.conduct(this)
    }
  }

  conduct () {
    let swc = this.target.swc
    swc.pushOp(this)
    swc.deleteNode(this.target)
  }

  cancel () {
    let swc = this.target.swc
    swc.popOp()
    swc.undoDeleteNode(this.target)
  }

  toString () {
    return `Delete(${this.target.index})`
  }

}
