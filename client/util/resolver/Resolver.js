import Supervisor from '../Supervisor'
import Matcher from './Matcher'
import { CONDUCT_EVENT } from '../operation/OperationProxy'

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
