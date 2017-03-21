import Supervisor from '../Supervisor'
import Matcher from './Matcher'
import { CONDUCT_EVENT } from '../operation/OperationProxy'
import Swc from '../swc/Swc'

export default class Resolver extends Supervisor {

  /**
   *
   * @param {string} master
   * @param {string} slave
   * @param {Slices} slices
   */
  constructor (master, slave, slices) {
    super()
    this.master = new Swc(master, 0x444400)
    this.slave = new Swc(slave, 0x000022)
    this.slices = slices
    this.matcher = new Matcher(this.master, this.slave)
    this.operationMap.set('match', () => this.matcher.match())
    this.operationEvents.set(CONDUCT_EVENT, () => this.matcher.recover())
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
