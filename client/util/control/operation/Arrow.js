import NodeOperation from './NodeOperation'

export default class Arrow extends NodeOperation {

  constructor (gui) {
    super(gui)
    this.mode = 'drag'
  }

  /**
   *
   * @param {HatuNode} node
   */
  dragStart (node) {
    this.gui.node = node
    this.oldPosition = node.position.clone()
    this.gui.dom.style.cursor = 'move'
  }

  /**
   *
   * @param {HatuNode} node
   * @param {Vector3} position
   */
  drag (node, position) {
    node.position.copy(position)

    node.adjust()
    this.gui.node = node
  }

  /**
   *
   * @param {HatuNode} node
   */
  dragEnd (node) {
    this.gui.node = node
    this.gui.dom.style.cursor = 'auto'
    this.newPosition = node.position.clone()
    this.gui.viewer.operationProxy.conduct(this)
  }

  conduct () {
    if (this.gui.selectedNode) {
      this.target = this.gui.selectedNode
    } else {
      return
    }
    switch (this.mode) {
      case 'drag':
        this.target.position.copy(this.newPosition)
        break
      case 'radius':
        console.log('conduct radius')
        this.oldRadius = this.target.radius
        this.target.radius = this.radius
        break
      case 'x':
        this.oldX = this.target.position.x
        this.target.position.x = this.x
        break
      case 'y':
        this.oldY = this.target.position.y
        this.target.position.y = this.y
        break
      case 'z':
        this.oldZ = this.target.position.z
        this.target.position.z = this.z
        break
    }
    this.target.adjust()
    this.gui.setupOperation()
  }

  cancel () {
    if (!this.target) {
      return
    }
    switch (this.mode) {
      case 'drag':
        this.target.position.copy(this.oldPosition)
        break
      case 'radius':
        this.target.radius = this.oldRadius
        break
      case 'x':
        this.target.position.x = this.oldX
        break
      case 'y':
        this.target.position.y = this.oldY
        break
      case 'z':
        this.target.position.z = this.oldZ
        break
    }
    this.target.adjust()
  }

  deactivate () {

  }

  uninstall () {

  }
}
