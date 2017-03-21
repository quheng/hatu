export default class Matcher {

  /**
   *
   * @param {Swc} master
   * @param {Swc} slave
   */
  constructor (master, slave) {
    this.master = master
    this.slave = slave
    this.isDyed = false
  }

  match () {
    this.clear(this.master.root)
    this.clear(this.slave.root)
    this.traverse(this.master.root, this.slave.nearest(this.master.root))
    this.checkChildren(this.master.root)
    this.checkChildren(this.slave.root)
    this.merge(this.master.root)
    this.merge(this.slave.root)
    this.dye(this.master)
    this.dye(this.slave)
  }

  dye (swc) {
    this.isDyed = true
    swc.getNodes().forEach(node => {
      if (node.mergeable) {
        node.emissive = 0x0000aa
      } else {
        node.emissive = 0xaa0000
      }
      if (node.matched) {
        node.emissive = 0x00aa00
      }
    })
  }

  recover () {
    if (this.isDyed) {
      this.isDyed = false
      Matcher.recoverColor(this.master)
      Matcher.recoverColor(this.slave)
    }
  }

  static recoverColor (swc) {
    swc.getNodes().forEach(node => {
      node.emissive = node.themeColor
    })
  }

  /**
   *
   * @param {HatuNode} masterParent
   * @param {HatuNode} slaveParent
   */
  traverse (masterParent, slaveParent) {
    for (let masterChild of masterParent.sons) {
      let slaveChild = this.slave.nearest(masterChild)
      if (masterParent.distanceTo(slaveParent) < 1 && masterChild.distanceTo(slaveChild) < 1) {
        masterParent.matched = true
        masterChild.matched = true
        slaveParent.matched = true
        slaveChild.matched = true
      }
      this.traverse(masterChild, slaveChild)
    }
  }

  /**
   *
   * @param {HatuNode} root
   */
  checkChildren (root) {
    for (let child of root.sons) {
      this.checkChildren(child)
      if (child.matched || child.matchedChildren) root.matchedChildren = true
    }
  }

  /**
   *
   * @param {HatuNode} root
   */
  merge (root) {
    if (root.matched) {
      root.mergeable = true
    } else if (!root.isRoot && (root.parentNode.matched || root.parentNode.mergeable) && !root.matchedChildren) {
      root.mergeable = true
    }
    for (let child of root.sons) {
      this.merge(child)
    }
  }

  /**
   *
   * @param {HatuNode} root
   */
  clear (root) {
    root.matched = false
    root.mergeable = false
    root.matchedChildren = false
    for (let child of root.sons) this.clear(child)
  }

}
