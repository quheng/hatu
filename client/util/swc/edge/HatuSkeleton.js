import * as THREE from 'three'
import { threeColors } from '../../renderer/material/Material'

export default class HatuSkeleton extends THREE.Line {


  /**
   *
   * @param {HatuNode} node
   * @param {HatuNode} nodeParent
   * @param {HatuEdge} edge
   */
  constructor (node, nodeParent, edge) {
    let material = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors })
    let geometry = new THREE.Geometry()
    super(geometry, material)
    this.childColor = HatuSkeleton.nodeColor(node)
    this.parentColor = HatuSkeleton.nodeColor(nodeParent)

    this.node = node
    this.nodeParent = nodeParent
    this.edge = edge
    this.adjust()
  }

  adjust () {
    this.geometry = this.generateSkeleton(this.node.position, this.nodeParent.position)
  }

  generateSkeleton (nodePosition, parentPosition) {
    let child = new THREE.Vector3(nodePosition.x, nodePosition.y, nodePosition.z)
    let parent = new THREE.Vector3(parentPosition.x, parentPosition.y, parentPosition.z)

    let geometry = new THREE.Geometry()
    geometry.vertices.push(child)
    geometry.colors.push(this.childColor)
    geometry.vertices.push(parent)
    geometry.colors.push(this.parentColor)
    return geometry
  }

  static nodeColor (node) {
    return threeColors[node.type % threeColors.length]
  }
}
