import NodeOperation from './NodeOperation'

export default class Delete extends NodeOperation {

  /**
   *
   * @param {Array.<String>} src
   * @return {NodeOperation}
   */
  from (src) {
    this.target = this.swc.getNodeByIndex(parseInt(src[1]))
    return this
  }

  /**
   *
   * @param {HatuNode} node
   */
  dragStart (node) {
    this.swc=node.swc
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
    return `Delete ${this.target.index}`
  }

  /**
   *
   * @param {NodeOperation} op
   */
  match (op) {
    if (op instanceof Delete) {
      return this.target.index === op.target.index
    } else {
      return false
    }
  }
}
