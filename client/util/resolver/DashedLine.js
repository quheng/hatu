import * as THREE from 'three'

export default class DashedLine extends THREE.Line {

  /**
   *
   * @param {HatuNode} node
   * @param {Swc} another
   * @param {Resolver} resolver
   */
  constructor (node, another, resolver) {
    let geometry = new THREE.Geometry()
    let material = new THREE.LineDashedMaterial({
      color: 0x00ff00,
      dashSize: 2,
      gapSize: 2
    })

    super(geometry, material)

    this.node = node
    this.another = another
    this.resolver = resolver
    this.node.addObserver(this)

    this.updateSlave()
    this.updateGeometry()
  }

  notify () {
    this.minimalDistance = 10000000
    let oldSlave = this.slave
    this.another.getNodes().forEach(node => {
      let distance = node.distanceTo(this.node)
      let line = node.annotationLine
      if (this.minimalDistance > distance) {
        this.minimalDistance = distance
        this.slave = node
      }
      if (line.slave === this.node) {
        line.updateSlave()
        line.updateGeometry()
      }
      if (line.minimalDistance > distance) {
        line.slave = this.node
        line.updateGeometry()
      }
    })
    if (!oldSlave.annotationLine) {
      console.log(oldSlave)
    }
    oldSlave.annotationLine.updateSlave()
    oldSlave.annotationLine.updateGeometry()
    this.updateGeometry()
  }

  updateSlave () {
    this.minimalDistance = 10000000
    this.slave = this.node
    this.another.getNodes().forEach(node => {
      let distance = node.distanceTo(this.node)
      if (this.minimalDistance > distance) {
        this.minimalDistance = distance
        this.slave = node
      }
    })
  }

  updateGeometry () {
    this.geometry = new THREE.Geometry()
    this.geometry.vertices.push(this.node.position.clone())
    this.geometry.vertices.push(this.slave.position.clone())
    this.geometry.computeLineDistances()
  }

}
