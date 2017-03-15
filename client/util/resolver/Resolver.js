import Supervisor from '../Supervisor'
import DashedLine from './DashedLine'

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
    this.edgeNum = this.master.getNodes().length + this.slave.getNodes().length
    this.master.getNodes().forEach(node => {
      let line = new DashedLine(node, slave, this)
      this.annotation.add(line)
      node.annotationLine=line
    })
    this.slave.getNodes().forEach(node => {
      let line = new DashedLine(node, master, this)
      this.annotation.add(line)
      node.annotationLine=line
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
