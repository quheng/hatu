import { colors } from '../renderer/material/Material'
import * as THREE from 'three'
import HatuEdge from './edge/HatuEdge'

export default class HatuNode extends THREE.Mesh {

  /**
   *
   * @param node
   * @param {Swc} swc
   * @param {Number} themeColor
   */
  constructor (node, swc, themeColor) {
    let r1 = node.radius || 0.01
    let geometry = new THREE.SphereBufferGeometry(r1, HatuNode.calcSeg(r1), HatuNode.calcSeg(r1))
    let material = new THREE.MeshPhongMaterial({
      color: colors[0],
      specular: colors[0]
    })

    super(geometry, material)
    this.childrenNode = new Map()
    this.index = node.index
    this.type = node.type
    this.father = node.parent
    this.position.set(node.x, node.y, node.z)
    this.observers = new Set()
    this.swc = swc
    this.themeColor = themeColor
    this.emissive = themeColor
  }

  set emissive (color) {
    this.material.emissive.setHex(color)
  }

  /**
   *
   * @return {Iterator.<HatuNode>}
   */
  get sons () {
    return this.childrenNode.keys()
  }

  toString () {
    return {
      index: this.index,
      type: this.type,
      father: this.father,
      radius: this.radius,
      x: this.x,
      y: this.y,
      z: this.z
    }.toString()
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
   * @return {Number}
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
    this.observers.forEach(observer => observer.notify())
  }

  addObserver (observer) {
    this.observers.add(observer)
  }

  deleteObserver (observer) {
    this.observers.delete(observer)
  }

  get radius () {
    return this.geometry.parameters.radius
  }

  set radius (radius) {
    let r1 = radius || 0.01
    this.geometry = new THREE.SphereBufferGeometry(r1, HatuNode.calcSeg(r1), HatuNode.calcSeg(r1))
  }

  get x () {
    return this.position.x
  }

  set x (x) {
    this.position.x = x
  }

  get y () {
    return this.position.y
  }

  set y (y) {
    this.position.y = y
  }

  get z () {
    return this.position.z
  }

  set z (z) {
    this.position.z = z
  }


  bindProxy (proxy) {
    this.proxy = proxy
  }

  /**
   *
   * @return {NodeProxy}
   */
  getProxy () {
    return this.proxy
  }

}
