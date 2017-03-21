import Supervisor from './Supervisor'
import Swc from './swc/Swc'

export default class Editor extends Supervisor {

  /**
   *
   * @param {string} source
   * @param {Slices} slices
   */
  constructor (source, slices) {
    super()
    this.swc = new Swc(source, 0)
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
