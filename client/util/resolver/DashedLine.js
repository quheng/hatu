import * as THREE from "three"

export default class DashedLine extends THREE.Line {

  /**
   *
   * @param {HatuNode} node
   * @param {Swc} another
   */
  constructor (node, another) {
    let geometry = new THREE.Geometry()
    let material = new THREE.LineDashedMaterial({
      color: 0x00ff00,
      dashSize: 5,
      gapSize: 5
    })

    super(geometry, material)
    this.node = node
    this.another = another
    this.node.addObserver(this)
    this.notify()
  }

  notify () {
    let slave = this.another.nearest(this.node)
    if (this.slave != slave) {
      if (this.slave)
        this.slave.deleteObserver(this)
      this.slave = slave
      this.slave.addObserver(this)
    }
    this.geometry = new THREE.Geometry()
    this.geometry.vertices.push(this.node.position.clone())
    this.geometry.vertices.push(this.slave.position.clone())
    this.geometry.computeLineDistances()
  }

}