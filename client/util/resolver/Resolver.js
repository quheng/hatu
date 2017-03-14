import Supervisor from "../Supervisor"
import DashedLine from "./DashedLine"

export default class Resolver extends Supervisor {

  /**
   *
   * @param {Swc} master
   * @param {Swc} slave
   * @param {Slices} slices
   */
  constructor (master, slave, slices) {
    super()
    this.master = master
    this.slave = slave
    this.slices = slices
    this.master.getNodes().forEach(node => this.annotation.add(new DashedLine(node, slave)))
    this.slave.getNodes().forEach(node => this.annotation.add(new DashedLine(node, master)))
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
