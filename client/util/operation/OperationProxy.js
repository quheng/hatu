import * as THREE from 'three'
import Arrow from './Arrow'
import AddBranch from './AddBranch'
import AddNode from './AddNode'
import DeleteNode from './DeleteNode'

export const GUI_UPDATE_EVENT = 'GUI_UPDATE'
export const DRAG_NODE_MODE_EVENT = 'NODE_MODE'
export const DRAG_EDGE_MODE_EVENT = 'EDGE_MODE'
export const CURSOR_POINTER_EVENT = 'CURSOR_POINTER'
export const CURSOR_AUTO_EVENT = 'CURSOR_AUTO'
export const CURSOR_MOVE_EVENT = 'CURSOR_MOVE'

export class OperationProxy extends THREE.EventDispatcher {

  constructor () {
    super()
    this.operations = []
    this.rear = 0
    this.selectedNode = null
    this.operationName = 'Arrow'
  }

  undo () {
    if (this.rear > 0) {
      this.rear--
      this.operations[this.rear].cancel()
    }
    this.dispatchEvent({ type: GUI_UPDATE_EVENT })
  }

  redo () {
    if (this.rear < this.operations.length) {
      this.operations[this.rear].conduct()
      this.rear++
    }
    this.dispatchEvent({ type: GUI_UPDATE_EVENT })
  }

  /**
   *
   * @param {NodeOperation} operation
   */
  conduct (operation) {
    operation.conduct()
    this.operations[this.rear] = operation
    this.rear++
    this.operations = this.operations.slice(0, this.rear)
    this.setupOperation()
  }

  /**
   * create operation instance according to name
   * @param {String} name
   * @return {NodeOperation}
   */
  create (name) {
    switch (name) {
      case 'Arrow':
        return new Arrow(this)
      case 'AddBranch':
        return new AddBranch(this)
      case 'AddNode':
        return new AddNode(this)
      case 'DeleteNode':
        return new DeleteNode(this)
    }
  }

  setNode (value) {
    if (this.selectedNode) {
      this.selectedNode.material.emissive.setHex(this.selectedNode.currentHex)
    }
    this.selectedNode = value
    this.selectedNode.currentHex = value.material.emissive.getHex()
    this.selectedNode.material.emissive.setHex(0xff0000)
    this.dispatchEvent({ type: GUI_UPDATE_EVENT })
  }

  /**
   *
   * @return {HatuNode}
   */
  getNode () {
    return this.selectedNode
  }

  resetNode () {
    if (this.selectedNode) {
      this.selectedNode.material.emissive.setHex(this.selectedNode.currentHex)
    }
    this.selectedNode = null
    this.dispatchEvent({ type: GUI_UPDATE_EVENT })
  }

  setupOperation () {
    if (this.currentOperation) {
      this.currentOperation.deactivate()
    }
    this.currentOperation = this.create(this.operationName)
  }

  change (operationName) {
    this.operationName = operationName
    if (this.currentOperation) {
      this.currentOperation.uninstall()
    }
    this.setupOperation()
    this.currentOperation.activate()
    this.resetNode()
  }
}
