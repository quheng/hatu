import * as THREE from 'three'
export default class Supervisor {

  constructor () {
    this.annotation = new THREE.Object3D()
    this.operationMap = new Map()
    this.operationEvents = new Map()
  }

  /**
   *
   * @return {[Swc]}
   */
  getSwcs () {
  }

  /**
   *
   * @return {Slices}
   */
  getSlice () {
  }

  /**
   *
   * @return {string}
   */
  getResult () {
  }

  /**
   *
   * @return {HatuNode[]}
   */
  getNodes () {

  }

  /**
   *
   * @return {HatuSkeleton[]|HatuCylinder[]}
   */
  getEdges () {

  }

  /**
   *
   * @return {Object3D}
   */
  getAnnotation () {
    return this.annotation
  }

  /**
   *
   * @return {Map.<string, function()>}
   */
  getGuiMode () {
    return this.operationMap
  }

  /**
   *
   * @return {Map.<string, function()>}
   */
  getOperationEvents () {
    return this.operationEvents
  }

}
