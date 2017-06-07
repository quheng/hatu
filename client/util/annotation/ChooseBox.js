import * as THREE from 'three'
export default class ChooseBox extends THREE.Line {

  constructor () {
    let geometry = new THREE.Geometry()
    let material = new THREE.LineDashedMaterial({
      color: 0x00ff00,
      dashSize: 2,
      gapSize: 2
    })

    super(geometry, material)
  }

  /**
   *
   * @param {Vector3} position1
   * @param {Vector3} position2
   */
  notify (position1, position2) {
    let v1 = new THREE.Vector3(position1.x, position1.y, 10)
    let v2 = new THREE.Vector3(position1.x, position2.y, 10)
    let v3 = new THREE.Vector3(position2.x, position2.y, 10)
    let v4 = new THREE.Vector3(position2.x, position1.y, 10)
    let v5 = new THREE.Vector3(position1.x, position1.y, 10)

    this.geometry = new THREE.Geometry()
    this.geometry.vertices.push(v1)
    this.geometry.vertices.push(v2)
    this.geometry.vertices.push(v3)
    this.geometry.vertices.push(v4)
    this.geometry.vertices.push(v5)
    this.geometry.computeLineDistances()
  }

}
