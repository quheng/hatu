import Supervisor from '../Supervisor'
import Matcher from './Matcher'
import { CONDUCT_EVENT } from '../operation/OperationProxy'
import Swc from '../swc/Swc'
import NodeProxy from './NodeProxy'

export default class Resolver extends Supervisor {

  /**
   *
   * @param {string} master
   * @param {string} slave
   * @param {Slices} slices
   * @param {string} ancestor
   */
  constructor (master, slave, slices, ancestor) {
    super()
    this.master = new Swc(master, 0x444400)
    this.slave = new Swc(slave, 0x000022)
    this.ancestor = new Swc(ancestor, 0x0)
    this.slices = slices

    this.operationMap.set('match', () => this.match())
    this.operationEvents.set(CONDUCT_EVENT, () => this.recover())
  }

  /**
   *
   * @return {boolean}
   */
  match () {
    let masterRoot = NodeProxy.from(this.master)
    let slaveRoot = NodeProxy.from(this.slave)
    let ancestorRoot = NodeProxy.from(this.ancestor)
    new Matcher(masterRoot, ancestorRoot).match()
    new Matcher(slaveRoot, ancestorRoot).match()
    new Matcher(masterRoot, slaveRoot).match()
    this.checkUnChanged(this.master, this.slave, this.ancestor)

    this.mergeable = true
    this.dye(this.master, this.slave, this.ancestor)
    this.dye(this.slave, this.master, this.ancestor)

    return this.mergeable
  }

  /**
   *
   * @param {Swc} master
   * @param {Swc} slave
   * @param {Swc} ancestor
   */
  dye (master, slave, ancestor) {
    this.isDyed = true
    master.getNodes().forEach(node => {
      if (node.getProxy().getMergeable(slave)) {
        node.emissive = 0x0000aa
      } else {
        this.mergeable = false
        node.emissive = 0xaa0000
      }
      if (node.getProxy().getMatched(slave)) {
        node.emissive = 0x00aa00
      }
    })
  }

  /**
   *
   * @param {Swc} master
   * @param {Swc} slave
   * @param {Swc} ancestor
   */
  checkUnChanged (master, slave, ancestor) {
    master.getNodes().forEach(node => {
      let slaveNode = node.getProxy().getMatched(slave)
      if (slaveNode && node.getProxy().getMatched(ancestor)) {
        if (!node.isRoot && !node.getProxy().parent.getMergeable(this.slave)) {
          this.search(node.getProxy(), slaveNode)
        }

      }
    })
  }

  /**
   *
   * @param {NodeProxy} masterNode
   * @param {NodeProxy} slaveNode
   */
  search (masterNode, slaveNode) {
    let tmp = masterNode
    let masterEnd
    let slaveEnd
    while (!tmp.isRoot) {
      tmp = tmp.parent
      tmp.setLabel(masterNode)
    }

    tmp = slaveNode
    while (!tmp.isRoot) {
      tmp = tmp.parent
      let mtn = tmp.getMatched(this.master)
      if (mtn && mtn.getLabel() == masterNode) {
        masterEnd = mtn
        slaveEnd = tmp
      }
    }

    if (masterEnd && slaveEnd)
      if (this.checkCorrect(masterNode, masterEnd) || this.checkCorrect(slaveNode, slaveEnd)) {
        this.unChangedMerge(masterNode, masterEnd, this.slave)
        this.unChangedMerge(slaveNode, slaveEnd, this.master)
      }

  }

  /**
   *
   * @param {NodeProxy} start
   * @param {NodeProxy} end
   * @return {boolean}
   */
  checkCorrect (start, end) {
    let tmp = start
    while (tmp != end && !tmp.isRoot) {
      tmp = tmp.parent
      if (!tmp.getMatched(this.ancestor))
        return false
    }
    return true
  }

  /**
   *
   * @param {NodeProxy} start
   * @param {NodeProxy} end
   * @param {Swc} swc
   */
  unChangedMerge (start, end, swc) {
    let tmp = start
    while (tmp != end && !tmp.isRoot) {
      tmp = tmp.parent
      tmp.setMergeable(swc, true)
    }
  }

  recover () {
    if (this.isDyed) {
      this.isDyed = false
      Resolver.recoverColor(this.master)
      Resolver.recoverColor(this.slave)
    }
  }

  static recoverColor (swc) {
    swc.getNodes().forEach(node => {
      node.emissive = node.themeColor
    })
  }

  /**
   *
   * @return {[Swc]}
   */
  getSwcs () {
    return [this.master, this.slave]
  }

  /**
   *
   * @return {Slices}
   */
  getSlice () {
    return this.slices
  }

  /**
   *
   * @return {string}
   */
  getResult () {
    return this.master.serialize()
  }

  /**
   *
   * @return {HatuNode[]}
   */
  getNodes () {
    return this.master.getNodes().concat(this.slave.getNodes())
  }

  /**
   *
   * @return {HatuSkeleton[]|HatuCylinder[]}
   */
  getEdges () {
    return this.master.getEdges().concat(this.slave.getEdges())
  }

}
