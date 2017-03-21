import Supervisor from './Supervisor'

export default class Editor extends Supervisor {

  /**
   *
   * @param {Swc} swc
   * @param {Slices} slices
   */
  constructor (swc, slices) {
    super()
    this.swc = swc
    this.slices = slices
  }

  /**
   *
   * @return {[Swc]}
   */
  getSwcs () {
    return [this.swc]
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
    return this.swc.serialize()
  }

  /**
   *
   * @return {HatuNode[]}
   */
  getNodes () {
    return this.swc.getNodes()
  }

  /**
   *
   * @return {HatuSkeleton[]|HatuCylinder[]}
   */
  getEdges () {
    return this.swc.getEdges()
  }

}
