import { threeMaterials } from '../renderer/material/Material'
import * as THREE from 'three'
import HatuEdge from "./edge/HatuEdge"

export default class HatuNode extends THREE.Mesh {

  constructor (node) {
    let r1 = node.radius || 0.01
    let geometry = new THREE.SphereBufferGeometry(r1, HatuNode.calcSeg(r1), HatuNode.calcSeg(r1))
    super(geometry, threeMaterials[node.type].clone())
    this.childrenNode = new Map()
    this.index = node.index
    this.type = node.type
    this.father = node.parent
    this.position.set(node.x, node.y, node.z)
  }

  get isRoot () {
    return this.father === -1
  }

  static calcSeg (radius) {
    return Math.max(radius / 2, 6)
  }

  /**
   *
   * @param {HatuNode} node
   */
  distanceTo (node) {
    return this.position.distanceTo(node.position)
  }

  /**
   *Set parent and generate a edge accordingly. This generated edge would be returned
   * @param {HatuNode} parent
   * @returns {HatuEdge}
   */
  setParent (parent) {
    this.parentNode = parent
    this.father = parent.index
    this.parentEdge = new HatuEdge(this, this.parentNode)
    parent.addChild(this, this.parentEdge)
    return this.parentEdge
  }

  /**
   *Add a child with its edge
   * @param {HatuNode}child
   * @param {HatuEdge}edge
   */
  addChild (child, edge) {
    this.childrenNode.set(child, edge)
  }

  /**
   * Remove a specified child node
   * @param {HatuNode} child
   * @return {HatuEdge}
   */
  removeChild (child) {
    let edge = this.childrenNode.get(child)
    this.childrenNode.delete(child)
    return edge
  }

  adjust () {
    if (this.parentNode) {
      this.parentEdge.adjust()
    }
    this.childrenNode.forEach((edge, node) => edge.adjust())
  }

  get radius () {
    return this.geometry.parameters.radius
  }

  set radius (radius) {
    let r1 = radius || 0.01
    this.geometry = new THREE.SphereBufferGeometry(r1, HatuNode.calcSeg(r1), HatuNode.calcSeg(r1))
  }

}
