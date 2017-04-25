import NodeOperation from './NodeOperation'
import * as THREE from 'three'

export default class Interpolate extends NodeOperation {

  /**
   *
   * @param {OperationProxy} proxy
   */
  constructor (proxy) {
    super(proxy)

    this.newPosition = new THREE.Vector3(0, 0, 0)
    this.newRadius = 0
    this.parent = null
    this.children = []
  }

  toString () {
    return `Interpolate(${this.target.index},${this.parent.index},(${this.children.map(child => child.index).join(',')}),(${this.newPosition.x},${this.newPosition.y},${this.newPosition.z},${this.newRadius}))`
  }

}
