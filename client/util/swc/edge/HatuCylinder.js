import { threeMaterials } from '../../renderer/material/Material'
import * as THREE from 'three'

export default class HatuCylinder extends THREE.Mesh {

  /**
   *
   * @param {HatuNode} node
   * @param {HatuNode} nodeParent
   * @param {HatuEdge} edge
   */
  constructor (node, nodeParent, edge) {
    let coneMaterial = threeMaterials[nodeParent.type]
    let nodeVec = new THREE.Vector3(node.position.x, node.position.y, node.position.z)
    let nodeParentVec = new THREE.Vector3(nodeParent.position.x, nodeParent.position.y, nodeParent.position.z)
    let dist = nodeVec.distanceTo(nodeParentVec)

    let r1 = node.radius || 0.01
    let r2 = nodeParent.radius || 0.01
    let geometry = new THREE.CylinderGeometry(r1, r2, dist)
    super(geometry, coneMaterial)

    this.node = node
    this.nodeParent = nodeParent
    this.edge = edge
    this.adjust(node, nodeParent)
  }

  adjust () {
    let nodePosition = this.node.position
    let parentPosition = this.nodeParent.position
    let nodeVec = new THREE.Vector3(nodePosition.x, nodePosition.y, nodePosition.z)
    let nodeParentVec = new THREE.Vector3(parentPosition.x, parentPosition.y, parentPosition.z)
    let cylAxis = new THREE.Vector3().subVectors(nodeVec, nodeParentVec)
    cylAxis.normalize()
    let rotationAxis = new THREE.Vector3()
    rotationAxis.crossVectors(cylAxis, new THREE.Vector3(0, 1, 0))
    rotationAxis.normalize()
    let theta = Math.acos(cylAxis.y)

    this.matrixAutoUpdate = false
    this.matrix.makeRotationAxis(rotationAxis, -theta)
    let position = new THREE.Vector3((nodePosition.x + parentPosition.x) / 2, (nodePosition.y + parentPosition.y) / 2, (nodePosition.z + parentPosition.z) / 2)
    this.matrix.setPosition(position)

    let dist = nodeVec.distanceTo(nodeParentVec)
    this.geometry = new THREE.CylinderGeometry(this.node.radius, this.nodeParent.radius, dist)
  }

}
