import * as THREE from 'three'
import Edit from './Edit'
import AddBranch from './AddBranch'
import AddNode from './AddNode'
import Delete from './Delete'
import Interpolate from "./Interpolate"

export const GUI_UPDATE_EVENT = 'GUI_UPDATE'
export const DRAG_NODE_MODE_EVENT = 'NODE_MODE'
export const DRAG_EDGE_MODE_EVENT = 'EDGE_MODE'
export const CURSOR_POINTER_EVENT = 'CURSOR_POINTER'
export const CURSOR_AUTO_EVENT = 'CURSOR_AUTO'
export const CURSOR_MOVE_EVENT = 'CURSOR_MOVE'
export const CONDUCT_EVENT = 'CONDUCT'

export class OperationProxy extends THREE.EventDispatcher {

  constructor () {
    super()
    this.operations = []
    this.rear = 0
    this.selectedNode = null
    this.operationName = 'Edit'
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
    this.dispatchEvent({ type: CONDUCT_EVENT })
  }

  /**
   * create operation instance according to name
   * @param {String} name
   * @return {NodeOperation}
   */
  create (name) {
    switch (name) {
      case 'Edit':
        return new Edit(this)
      case 'AddBranch':
        return new AddBranch(this)
      case 'AddNode':
        return new AddNode(this)
      case 'Delete':
        return new Delete(this)
    }
  }

  setNode (value) {
    if (this.selectedNode) {
      this.selectedNode.emissive = this.selectedNode.themeColor
    }
    this.selectedNode = value
    this.selectedNode.emissive = 0xff0000
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

  /**
   *
   * @param {Swc} swc
   * @return {Array.<NodeOperation>}
   */
  compress (swc) {
    let operationMap = new Map()
    swc.operations.forEach(op => {
      let ops
      if (operationMap.has(op.target.index)) {
        ops = operationMap.get(op.target.index)
        if (op instanceof Delete) {
          if (ops[0] instanceof Interpolate) {
            ops = []
          } else {
            ops = [op]
          }
        } else if (op instanceof Edit) {
          if (ops[0] instanceof Interpolate) {
            ops[0].newPosition.copy(op.newPosition)
            ops[0].newRadius = op.newRadius
          } else {
            ops = [op]
          }
        }
      } else {
        ops = [op]
      }
      operationMap.set(op.target.index, ops)
    })

    let res = []
    for (let opArray of operationMap.values()) {
      opArray.forEach(op => res.push(op))
    }
    res.forEach(op => {
      if (op instanceof Interpolate) {
        let parent = op.getTarget().parentNode
        while (parent.index > op.getTarget().index) parent = parent.parentNode
        op.parent = parent

        op.children = []
        for (let son of op.getTarget().sons) {
          if (son.index < op.getTarget().index) {
            op.children.push(son)
          }
        }
      }
    })
    return res
  }

  read(){

  }
}
