import * as THREE from 'three'
import HatuNode from "./HatuNode"
import KdTree from "./KdTree"

export default class Swc extends THREE.Object3D {

  constructor (source) {
    super()
    this.centerNodeIndex = 1
    this.neuronMode = 'skeleton'
    this.nodes = []
    this.lastIndex = -1
    this.edges = []
    this.kdTree = Swc.initKdTree()
    this.deserialize(source)
    this.setPosition(-this.center[0], -this.center[1], -this.center[2])
  }

  /**
   *
   * @return {KdTree}
   */
  static initKdTree () {
    /**
     *
     * @param {HatuNode} a
     * @param {HatuNode} b
     * @return {number}
     */
    function distance (a, b) {
      return a.distanceTo(b)
    }

    return new KdTree([], distance, ['x', 'y', 'z'])
  }

  /**
   * deserialize the node information from string to object
   * @param {String} source swc in source string
   */
  deserialize (source) {
    let splittedLine = source.replace(/\r\n/g, '\n').split('\n')

    let floatReg = '-?\\d*(?:\\.\\d+)?'
    let positiveIntReg = '\\d+'
    let pattern = new RegExp('^[ \\t]*(' + [
        positiveIntReg,                // index
        positiveIntReg,                // type
        floatReg,                      // x
        floatReg,                      // y
        floatReg,                      // z
        floatReg,                      // radius
        '-1|' + positiveIntReg         // parent
      ].join(')[ \\t]+(') + ')[ \\t]*$')

    let nodes = []

    splittedLine.forEach(line => {
      let match = line.match(pattern)
      if (match) {
        let index = parseInt(match[1])
        let type = parseInt(match[2])
        let x = parseFloat(match[3])
        let y = parseFloat(match[4])
        let z = parseFloat(match[5])
        let radius = parseFloat(match[6])
        let parent = parseFloat(match[7])
        nodes[index] = new HatuNode({
          index: index,
          type: type,
          x: x,
          y: y,
          z: z,
          radius: radius,
          parent: parent
        })
        if (parent === -1) {
          this.root = index
        }
        if (this.lastIndex < index) {
          this.lastIndex = index
        }
        if (this.centerNodeIndex === index) {
          this.centerNode = nodes[index]
        }
      } else {
        if (line[0] !== '#' && line !== '') {
          throw new Error('swc format error at lien: ' + line)
        }
      }
    })

    nodes.forEach(node => {

      this.pushNode(node)

      if (!node.isRoot) {
        let edge = node.setParent(nodes[node.father])
        this.pushEdge(edge)
      }
    })

    this.boundingBox = this.calculateBoundingBox(this.centerNode)
    this.center = Swc.calculateCenterNode(this.boundingBox)
    this.avgRad = this.avgRadii()
  }

  setPosition (x, y, z) {
    this.position.set(x, y, z)
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
      let newEdge = child.setParent(parent)
      this.pushEdge(newEdge)
      this.removeEdge(edge)
    })
  }

  /**
   * undo deletion of a node.
   * @param {HatuNode} node
   */
  undoDeleteNode (node) {
    let parent = node.parentNode

    let childList = []
    node.childrenNode.forEach((edge, child) => {
      childList.push(child)
    })

    childList.forEach(child => {
      let newEdge = parent.removeChild(child)
      node.removeChild(child)
      let oldEdge = child.setParent(node)
      this.removeEdge(newEdge)
      this.pushEdge(oldEdge)
    })

    let parentEdge = node.setParent(parent)

    this.pushNode(node)
    this.pushEdge(parentEdge)
  }

  /**
   *
   * @param {HatuEdge} edge
   */
  addNode (edge) {
    let child = edge.node
    let parent = edge.nodeParent
    let position = child.position.clone().add(parent.position).divideScalar(2)
    let node = this.defaultNode(this.lastIndex, parent, position)
    this.lastIndex += 1
    parent.removeChild(child)
    this.pushEdge(node.setParent(parent))
    this.pushEdge(child.setParent(node))
    this.pushNode(node)
    this.removeEdge(edge)
    return node
  }

  undoAddNode (node) {
    this.deleteNode(node)
  }

  /**
   *
   * @param {HatuNode} parent
   * @param {Vector3} position
   *
   */
  addBranch (parent, position) {
    let node = this.defaultNode(this.lastIndex, parent, position)
    this.lastIndex += 1
    let edge = node.setParent(parent)
    this.pushNode(node)
    this.pushEdge(edge)
    return node
  }

  undoAddBranch (node) {
    this.deleteNode(node)
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

  /**
   *
   * @param {HatuNode} node
   */
  pushNode (node) {
    this.nodes.push(node)
    this.kdTree.insert(node)
    super.add(node)
  }

  /**
   *
   * @param {HatuNode} node
   */
  removeNode (node) {
    this.nodes = this.erase(this.nodes, node)
    this.kdTree.remove(node)
    super.remove(node)
  }

  /**
   *
   * @param {HatuEdge} edge
   */
  pushEdge (edge) {
    this.edges.push(edge)
    super.add(edge.obj(this.neuronMode))
  }

  /**
   *
   * @param {HatuEdge} edge
   */
  removeEdge (edge) {
    this.edges = this.erase(this.edges, edge)
    super.remove(edge.obj(this.neuronMode))
  }

  edgeMode (mode) {
    this.edges.forEach(edge => {
      super.remove(edge.obj(this.neuronMode))
    })
    this.neuronMode = mode
    this.edges.forEach(edge => {
      super.add(edge.obj(this.neuronMode))
    })
  }

  /**
   *
   * @param {Array} array
   * @param element
   */
  erase (array, element) {
    return array.filter(e => e !== element)
  }

  getNodes () {
    return this.nodes
  }

  getEdges () {
    return this.edges.map(e => e.obj(this.neuronMode))
  }

  /**
   * @return {String}
   */
  serialize () {

  }

  avgRadii () {
    let radiiSum = 0
    let radiiCount = 0
    this.nodes.forEach(node => {
      radiiSum += node.radius
      radiiCount++
    })
    return radiiSum / radiiCount
  }

  /**
   * calculates bounding box for neuron object
   * @param centerNode
   * @return {{xmin, xmax, ymin, ymax, zmin, zmax}}
   */
  calculateBoundingBox (centerNode) {
    let boundingBox = {
      'xmin': centerNode.position.x,
      'xmax': centerNode.position.x,
      'ymin': centerNode.position.y,
      'ymax': centerNode.position.y,
      'zmin': centerNode.position.z,
      'zmax': centerNode.position.z
    }
    this.nodes.forEach(node => {
      if (node.position.x < boundingBox.xmin) boundingBox.xmin = node.position.x
      if (node.position.x > boundingBox.xmax) boundingBox.xmax = node.position.x
      if (node.position.y < boundingBox.ymin) boundingBox.ymin = node.position.y
      if (node.position.y > boundingBox.ymax) boundingBox.ymax = node.position.y
      if (node.position.z < boundingBox.zmin) boundingBox.zmin = node.position.z
      if (node.position.z > boundingBox.zmax) boundingBox.zmax = node.position.z
    })
    return boundingBox
  }

  static calculateCenterNode (boundingBox) {
    return [(boundingBox.xmax + boundingBox.xmin) / 2, (boundingBox.ymax + boundingBox.ymin) / 2, (boundingBox.zmax + boundingBox.zmin) / 2]
  }
}