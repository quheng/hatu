export default class NodeProxy {

  /**
   *
   * @param {HatuNode} node
   */
  constructor (node) {
    this.node = node
    this.children = []
    this.node.bindProxy(this)
    this.isMatched = new Map()
    this.isMergeable = new Map()
    this.umc = new Map()
  }

  /**
   *
   * @param {Swc} swc
   * @return {NodeProxy}
   */
  nearest (swc) {
    return swc.nearest(this.node).getProxy()
  }

  /**
   *
   * @param {NodeProxy} proxy
   * @return {Number}
   */
  distanceTo (proxy) {
    return this.node.distanceTo(proxy.node)
  }

  /**
   *
   * @param {NodeProxy} child
   */
  setChild (child) {
    this.children.push(child)
    child.parent = this
  }

  /**
   *
   * @return {Array}
   */
  get sons () {
    return this.children
  }

  get isRoot () {
    return this.node.isRoot
  }

  /**
   *
   * @param {NodeProxy} v
   */
  set parent (v) {
    this.parentProxy = v
  }


  /**
   *
   * @return {NodeProxy}
   */
  get parent () {
    return this.parentProxy
  }

  /**
   *
   * @param {Swc} swc
   * @param {NodeProxy} v
   */
  setMatched (swc, v) {
    this.isMatched.set(swc, v)
  }

  /**
   *
   * @param {Swc} swc
   * @return {NodeProxy}
   */
  getMatched (swc) {
    if (this.isMatched.has(swc))
      return this.isMatched.get(swc)
    else
      return null
  }

  /**
   *
   * @param {Swc} swc
   * @param {boolean} v
   */
  setMergeable (swc, v) {
    this.isMergeable.set(swc, v)
  }

  /**
   *
   * @param {Swc} swc
   * @return {boolean}
   */
  getMergeable (swc) {
    if (this.isMergeable.has(swc))
      return this.isMergeable.get(swc)
    else
      return false
  }

  /**
   *
   * @param {Swc} swc
   * @param {NodeProxy} v
   */
  setMatchedChildren (swc, v) {
    this.umc.set(swc, v)
  }

  /**
   *
   *
   * @param {Swc} swc
   * @return {NodeProxy}
   */
  getMatchedChildren (swc) {
    if (this.umc.has(swc))
      return this.umc.get(swc)
    else
      return null
  }

  setLabel (label) {
    this.label = label
  }

  getLabel () {
    return this.label
  }

  /**
   *
   * @param {Swc} swc
   * @return {NodeProxy}
   */
  static from (swc) {
    return NodeProxy.construct(swc.root)
  }


  /**
   *
   * @param {HatuNode} node
   * @return {NodeProxy}
   */
  static construct (node) {
    let proxy = new NodeProxy(node)
    for (let child of node.sons) {
      proxy.setChild(NodeProxy.construct(child))
    }
    return proxy
  }
}