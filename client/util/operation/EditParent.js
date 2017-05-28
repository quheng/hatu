import NodeOperation from "./NodeOperation"

export default class EditParent extends NodeOperation {

  /**
   *
   * @param {OperationProxy} proxy
   * @param {Swc} swc
   */
  constructor (proxy, swc) {
    super(proxy, swc)
    this.parent = null
    this.oldParent = null
  }

  getTarget () {
    return super.getTarget()
  }

  /**
   *
   * @param {Array.<String>} src
   * @return {NodeOperation}
   */
  from (src) {
    this.target = this.swc.getNodeByIndex(parseInt(src[1]))
    this.parent = this.swc.getNodeByIndex(parseInt(src[2]))

    return this
  }

  toString () {
    return `EditParent ${this.target.index} ${this.parent ? this.parent.index : -1}`
  }

  conduct () {
    let swc = this.target.swc
    swc.pushOp(this)
    swc.editParent(this.target, this.parent)
  }

  cancel () {
    let swc = this.target.swc
    swc.popOp()
    swc.undoEditParent(this.target, this.oldParent)
  }

  /**
   *
   * @param {NodeOperation} op
   * @return {boolean}
   */
  match (op) {
    if (op instanceof EditParent)
      return (this.target.index === op.target.index) && ((!this.parent && !op.parent) || (this.parent.index === op.parent.index))
    else
      return false
  }
}