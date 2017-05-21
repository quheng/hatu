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
    this.deleteNode = false
    this.matchResult = false
    this.mergeResult = false
  }

  /**
   *
   * @param {boolean} v
   */
  setMatchResult (v) {
    this.matchResult = v
  }

  /**
   *
   * @return {boolean}
   */
  getMatchResult () {
    return this.matchResult
  }

  /**
   *
   * @param {boolean} v
   */
  setMergeResult (v) {
    this.mergeResult = v
  }

  /**
   *
   * @return {boolean}
   */
  getMergeResult () {
    return this.mergeResult
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
   * @param {NodeProxy} proxy
   * @return {Boolean}
   */
  match (proxy) {
    return this.distanceTo(proxy) < 1 && Math.pow(this.node.radius - proxy.node.radius, 2) < 1
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
    if (this.isMatched.has(swc)) {
      return this.isMatched.get(swc)
    } else {
      return null
    }
  }

  /**
   *
   * @param {Swc} swc
   * @param {boolean} v
   */
  setMergeable (swc, v) {
    if (this.isMergeable.has(swc))
      this.isMergeable.set(swc, v && this.isMergeable.get(swc))
    else
      this.isMergeable.set(swc, v)
  }

  /**
   *
   * @param {Swc} swc
   * @return {boolean}
   */
  getMergeable (swc) {
    if (this.isMergeable.has(swc)) {
      return this.isMergeable.get(swc)
    } else {
      return false
    }
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
    if (this.umc.has(swc)) {
      return this.umc.get(swc)
    } else {
      return null
    }
  }

  setDelete () {
    this.deleteNode = true
  }

  isDelete () {
    return this.deleteNode
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
   */
  static from (swc) {
    swc.getNodes().forEach(node => NodeProxy.construct(node))
  }

  /**
   *
   * @param {HatuNode} node
   * @return {NodeProxy}
   */
  static construct (node) {
    return new NodeProxy(node)
  }
}
