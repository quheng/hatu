import Supervisor from "../Supervisor"
import Swc from "../swc/Swc"
import { OperationProxy, CONDUCT_EVENT } from "../operation/OperationProxy"
import Merger from "./Merger"

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
    this.slices = slices

    console.log(master)

    this.proxy = new OperationProxy()
    this.master = new Swc(ancestor, 0x444400)
    this.divider = this.master.lastIndex
    console.log(this.divider)
    this.proxy.from(master, this.master)
    this.slave = new Swc(ancestor, 0x000022)
    this.proxy.from(slave, this.slave)
    this.merger = new Merger(this.master, this.slave)

    this.operationMap.set('match', () => {
      this.merger.merge()
      this.dye(this.master, this.slave)
      this.dye(this.slave, this.master)
      return false
    })
    this.operationEvents.set(CONDUCT_EVENT, () => this.recover())
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

  /**
   *
   * @param {Swc} master
   * @param {Swc} slave
   */
  dye (master, slave) {
    this.isDyed = true
    master.getNodes().forEach(node => {
      if (node.getProxy().getMergeResult()) {
        node.emissive = 0x0000aa
        if (node.getProxy().getMatchResult()) {
          node.emissive = 0x00aa00
        }
      } else {
        node.emissive = 0xaa0000
      }
    })
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

}
