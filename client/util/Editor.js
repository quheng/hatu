import Supervisor from './Supervisor'
import Swc from './swc/Swc'
import { OperationProxy } from "./operation/OperationProxy"

export default class Editor extends Supervisor {

  /**
   *
   * @param {string} source
   * @param {string} operations
   * @param {Slices} slices
   */
  constructor (source, operations, slices) {
    super()
    let ancestor = new Swc(source, 0)
    this.proxy = new OperationProxy()
    this.proxy.from(operations, ancestor)
    this.slices = slices
    this.swc = new Swc(ancestor.serialize(), 0x444400)

    this.operationMap.set('commit', () => {
      if (this.commitCallback) {
        let ops = this.proxy.compress(this.swc)
        this.commitCallback(source, ancestor.operations.concat(ops).map(op => op.toString()).join('\n'))
      }
    })
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
