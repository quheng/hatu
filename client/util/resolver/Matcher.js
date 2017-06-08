export default class Matcher {

  /**
   *
   * @param {NodeProxy} masterRoot
   * @param {NodeProxy} slaveRoot
   */
  constructor (masterRoot, slaveRoot) {
    this.master = masterRoot.node.swc
    this.slave = slaveRoot.node.swc
    this.masterRoot = masterRoot
    this.slaveRoot = slaveRoot
    this.isDyed = false
  }

  match () {
    this.traverse(this.masterRoot, this.masterRoot.nearest(this.slave))

    this.checkChildren(this.masterRoot, this.slave)
    this.checkChildren(this.slaveRoot, this.master)
    this.merge(this.masterRoot, this.slave)
    this.merge(this.slaveRoot, this.master)
  }

  /**
   *
   * @param {NodeProxy} masterParent
   * @param {NodeProxy} slaveParent
   */
  traverse (masterParent, slaveParent) {
    for (let masterChild of masterParent.sons) {
      let slaveChild = masterChild.nearest(this.slave)
      if (masterParent.distanceTo(slaveParent) < 1 && masterChild.distanceTo(slaveChild) < 1) {
        masterParent.setMatched(this.slave, slaveParent)
        masterChild.setMatched(this.slave, slaveChild)
        slaveParent.setMatched(this.master, masterParent)
        slaveChild.setMatched(this.master, masterChild)
      }
      this.traverse(masterChild, slaveChild)
    }
  }

  /**
   *
   * @param {NodeProxy} root
   * @param {Swc} swc
   */
  checkChildren (root, swc) {
    for (let child of root.sons) {
      this.checkChildren(child, swc)
      let matchedNode = child.getMatched(swc)
      if (matchedNode == null) {
        matchedNode = child.getMatchedChildren(swc)
      }
      if (matchedNode) {
        root.setMatchedChildren(swc, matchedNode)
      }
    }
  }

  /**
   *
   * @param {NodeProxy} root
   * @param {Swc} swc
   */
  merge (root, swc) {
    if (root.getMatched(swc)) {
      root.setMergeable(swc, true)
    } else if (!root.isRoot && (root.parent.getMatched(swc) || root.parent.getMergeable(swc)) && !root.getMatchedChildren(swc)) {
      root.setMergeable(swc, true)
    }
    for (let child of root.sons) {
      this.merge(child, swc)
    }
  }

}
