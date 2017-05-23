import * as THREE from "three"
import Edit from "./Edit"
import AddBranch from "./AddBranch"
import AddNode from "./AddNode"
import Delete from "./Delete"
import Interpolate from "./Interpolate"
import Swc from "../swc/Swc"
import ChangeParent from "./ChangeParent"
import DeleteParent from "./DeleteParent"
import EditParent from "./EditParent"
import Trace from "./Trace"

export const GUI_UPDATE_EVENT = 'GUI_UPDATE'
export const DRAG_NODE_MODE_EVENT = 'NODE_MODE'
export const DRAG_EDGE_MODE_EVENT = 'EDGE_MODE'
export const CURSOR_POINTER_EVENT = 'CURSOR_POINTER'
export const CURSOR_AUTO_EVENT = 'CURSOR_AUTO'
export const CURSOR_MOVE_EVENT = 'CURSOR_MOVE'
export const CONDUCT_EVENT = 'CONDUCT'
export const CHOOSE_BOX_OPEN = 'CHOOSE_BOX_OPEN'
export const CHOOSE_BOX_UPDATE = 'CHOOSE_BOX_UPDATE'
export const CHOOSE_BOX_CLOSE = 'CHOOSE_BOX_CLOSE'
export const TRACE_BOX_OPEN = 'TRACE_BOX_OPEN'
export const TRACE_BOX_CLOSE = 'TRACE_BOX_CLOSE'

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
      case 'ChangeParent':
        return new ChangeParent(this)
      case 'DeleteParent':
        return new DeleteParent(this)
      case 'Trace':
        return new Trace(this)
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
    let epMap = new Map()
    swc.operations.forEach(op => {
      let ops
      ops = operationMap.get(op.target.index)
      if (op instanceof Delete) {
        if (!ops) {
          operationMap.set(op.target.index, [op])
        } else if (ops[0] instanceof Interpolate) {
          operationMap.set(op.target.index, [])
        } else {
          operationMap.set(op.target.index, [op])
        }
      } else if (op instanceof Edit) {
        if (!ops) {
          operationMap.set(op.target.index, [op])
        } else if (ops[0] instanceof Interpolate) {
          ops[0].newPosition.copy(op.newPosition)
          ops[0].newRadius = op.newRadius
        } else {
          operationMap.set(op.target.index, [op])
        }
      } else if (op instanceof EditParent) {
        if (!ops) {
          epMap.set(op.target.index, op)
        } else if (ops[0] instanceof Interpolate) {
          ops[0].parent = op.parent
        } else {
          epMap.set(op.target.index, op)
        }
      } else if (op instanceof Interpolate) {
        operationMap.set(op.target.index, [op])
      }

    })

    let res = []
    for (let opArray of operationMap.values()) {
      opArray.forEach(op => {
        res.push(op)
      })
    }

    for (let op of epMap.values()) {
      res.push(op)
    }

    let newNodes = new Set()
    res.forEach(op => {
      if (op instanceof Interpolate)
        newNodes.add(op.getTarget())
    })

    res.forEach(op => {
      if (op instanceof Interpolate) {
        op.parent = op.getTarget().parentNode

        op.children = []
        for (let son of op.getTarget().sons) {
          if (!newNodes.has(son)) {
            op.children.push(son)
          }
        }
      }
    })

    res.sort((a, b) => {
      if (a instanceof Interpolate && b instanceof Interpolate) {
        if (a.getTarget() === b.parent) return -1
        if (b.getTarget() === a.parent) return 1
      }
      return a.getTarget().index - b.getTarget().index
    })


    return res
  }

  /**
   *
   * @param {Swc} swc
   * @return {Swc}
   */
  clone (swc) {
    let ret = new Swc(swc.sourceStr, 0x0)
    this.from(swc.operations.map(op => op.toString()).join('\n'), ret)
    return ret
  }

  /**
   *
   * @param {String} src
   * @param {Swc} swc
   */
  from (src, swc) {
    let splittedLine = src.replace(/\r\n/g, '\n').split('\n')
    splittedLine.forEach(line => {
      let parts = line.split(' ')
      let op
      switch (parts[0]) {
        case 'Edit':
          op = new Edit(this, swc).from(parts)
          break
        case 'Interpolate':
          op = new Interpolate(this, swc).from(parts)
          break
        case 'Delete':
          op = new Delete(this, swc).from(parts)
          break
        case 'EditParent':
          op = new EditParent(this, swc).from(parts)
          break
      }
      if (!op) {
        console.log(parts[0])
      }
      op.conduct()
    })
  }
}
