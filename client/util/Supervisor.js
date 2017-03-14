import * as THREE from "three"
export default class Supervisor {


  constructor () {
    this.annotation = new THREE.Object3D()
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
}
