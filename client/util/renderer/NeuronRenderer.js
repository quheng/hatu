const THREE = require('three')
import Swc from '../Swc'
import HatuNode from './HatuNode'

export default class NeuronRenderer extends THREE.Object3D {
  constructor (viewer) {
    super()
    this.nodes = []
    this.edges = []
    this.swc = viewer.swc
    this.viewer = viewer
    this.avgRad = this.swc.avgRadii()

    this.swc.forEach(node => {
      let sphere = new HatuNode(node)
      this.add(sphere)
      this.nodes[node.index] = sphere
    })
    this.nodes.forEach(node => {
      if (node.father !== -1) {
        let cone = node.setParent(this.nodes[node.father], this.generateCone)
        this.edges.push(cone)
        if (this.viewer.showCones) {
          this.add(cone)
        }
      }
    })
  }

  setPosition (x, y, z) {
    this.position.set(x, y, z)
  }

  /**
   * export Swc structure from current mesh structure
   * @return {Swc}
   */
  exportAsSwc () {
    let swc = new Swc()
    this.nodes.forEach(e => {
      swc[e.index] = {
        'index': e.index,
        'type': e.type,
        'x': e.position.x,
        'y': e.position.y,
        'z': e.position.z,
        'radius': e.radius,
        'parent': e.father
      }
    })
    return swc
  }

  /**
   *
   * @param {HatuNode} node
   * @param {HatuNode} nodeParent
   * @return {HatuEdge}
   */
  generateCone (node, nodeParent) {
  }

  /**
   * delete a neuron node
   * @param {HatuNode} node
   */
  deleteNode (node) {
    let parent = node.parentNode
    let parentEdge = parent.removeChild(node)

    this.removeNode(node)
    this.removeEdge(parentEdge)

    node.childrenNode.forEach((edge, child) => {
      let newEdge = child.setParent(parent, this.generateCone)
      this.pushEdge(newEdge)
      this.removeEdge(edge)
    })
    node.childrenNode.clear()
  }

  /**
   *
   * @param {HatuEdge} edge
   */
  addNode (edge) {
    let child = edge.node
    let parent = edge.nodeParent
    let position = child.position.clone().add(parent.position).divideScalar(2)
    let node = this.defaultNode(this.nodes.length, parent, position)
    parent.removeChild(child)
    this.pushEdge(node.setParent(parent, this.generateCone))
    this.pushEdge(child.setParent(node, this.generateCone))
    this.pushNode(node)
    this.removeEdge(edge)
  }

  /**
   *
   * @param {HatuNode} parent
   * @param {Vector3} position
   */
  addBranch (parent, position) {
    let node = this.defaultNode(this.nodes.length, parent, position)
    let edge = node.setParent(parent, this.generateCone)
    this.pushNode(node)
    this.pushEdge(edge)
  }

  /**
   *
   * @param {Number} index
   * @param {HatuNode} parent
   * @param {Vector3} position
   * @return {HatuNode}
   */
  defaultNode (index, parent, position) {
    return new HatuNode({
      index: index,
      parent: parent.index,
      type: parent.type,
      x: position.x,
      y: position.y,
      z: position.z,
      radius: this.avgRad
    })
  }

  pushNode (node) {
    this.nodes[this.nodes.length] = node
    this.add(node)
  }

  removeNode (node) {
    this.nodes = this.erase(this.nodes, node)
    this.remove(node)
  }

  pushEdge (edge) {
    this.edges[this.edges.length] = edge
    this.add(edge)
  }

  removeEdge (edge) {
    this.edges = this.erase(this.edges, edge)
    this.remove(edge)
  }

  /**
   *
   * @param {Array}array
   * @param element
   */
  erase (array, element) {
    return array.filter(e => e !== element)
  }

  getNodes () {
    return this.nodes.filter(e => e !== undefined && e !== null)
  }

  getEdges () {
    return this.edges.filter(e => e !== undefined && e !== null)
  }
}
