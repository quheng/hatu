import EditParent from "./EditParent"
export default class ChangeParent extends EditParent {

  /**
   *
   * @param {OperationProxy} proxy
   */
  constructor (proxy) {
    super(proxy)
    this.count = 0
  }

  /**
   *
   * @param {HatuNode} node
   */
  dragStart (node) {
    if (node.isRoot) {
      window.alert('The root node has no parent!')
    } else if (this.count === 0) {
      this.proxy.setNode(node)
      this.count++
      this.target = node
      this.oldParent = [this.target.parentNode]
    } else if (this.count === 1) {
      this.parent = [node]
      this.proxy.conduct(this)
    }
  }
}