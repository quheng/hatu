import NodeOperation from './NodeOperation'
import * as THREE from 'three'

export default class Interpolate extends NodeOperation {

  /**
   *
   * @param {OperationProxy} proxy
   * @param {Swc} swc
   */
  constructor (proxy, swc) {
    super(proxy, swc)

    this.newPosition = new THREE.Vector3(0, 0, 0)
    this.newRadius = 0
    this.parent = null
    this.children = []
  }

  /**
   *
   * @param {Array.<String>} src
   * @return {NodeOperation}
   */
  from (src) {
    this.index = parseInt(src[1])
    this.parent = this.swc.getNodeByIndex(parseInt(src[2]))
    this.children = src[3].length != 2 ? src[3].slice(1, src[3].length - 1).split(',').map(str => this.swc.getNodeByIndex(parseInt(str))) : []

    let position = src[4].slice(1, src[4].length - 1).split(',')
    this.newPosition = new THREE.Vector3(parseFloat(position[0]), parseFloat(position[1]), parseFloat(position[2]))
    this.newRadius = parseFloat(src[5])

    return this
  }

  conduct () {
    this.swc.pushOp(this)
    this.target = this.swc.interpolate(this.index, this.parent, this.children, this.newPosition, this.newRadius)
  }

  cancel () {
    this.swc.popOp()
    this.swc.undoAddNode(this.target)
  }

  toString () {
    return `Interpolate ${this.target.index} ${this.parent ? this.parent.index : -1} (${this.children.map(child => child.index).join(',')}) (${this.newPosition.x},${this.newPosition.y},${this.newPosition.z}) ${this.newRadius}`
  }

}
