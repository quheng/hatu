import Interpolate from "../operation/Interpolate"
import { OperationProxy } from "../operation/OperationProxy"
import NodeProxy from "./NodeProxy"
import Edit from "../operation/Edit"
import EditParent from "../operation/EditParent"
import Swc from "../swc/Swc"
export default class Merger {

  /**
   *
   * @param {Swc} masterSrc
   * @param {Swc} slaveSrc
   */
  constructor (masterSrc, slaveSrc) {
    this.proxy = new OperationProxy()
    this.masterSrc = masterSrc
    this.slaveSrc = slaveSrc


    this.mergable = false
    this.result = []
  }

  /**
   *
   * @return {boolean}
   */
  merge () {
    this.scan()

    NodeProxy.from(this.master)
    NodeProxy.from(this.slave)

    Merger.associate(this.master, this.masterSrc)
    Merger.associate(this.slave, this.slaveSrc)

    let masterRes = this.initialize(this.master, this.slave)
    this.oldMasterOps = masterRes.oldOps
    this.oldMasterEPOps = masterRes.newEPOps
    this.newMasterOps = masterRes.newOps
    let slaveRes = this.initialize(this.slave, this.master)
    this.oldSlaveOps = slaveRes.oldOps
    this.oldSlaveEPOps = slaveRes.newEPOps
    this.newSlaveOps = slaveRes.newOps

    this.minimalIndex = 99999999
    for (let newOp of this.newMasterOps.values()) {
      if (this.minimalIndex > newOp.getTarget().index) {
        this.minimalIndex = newOp.getTarget().index
      }
    }

    this.mergeOldOps()
    this.mergeNewOps()
    this.mergeEPOps()
    console.log('------------------------')
    console.log(this.getResult().map(op => op.toString()).join('\n'))
    let m = this.check(this.master, this.slave)
    let s = this.check(this.slave, this.master)
    this.mergable = m && s
    return this.mergable
  }

  /**
   *
   * @param {Swc} src
   * @param {Swc} dest
   */
  static associate (src, dest) {
    src.getNodes().forEach(node => {
      dest.getNodeByIndex(node.index).bindProxy(node.getProxy())
    })
  }

  /**
   *
   * @return {Array.<NodeOperation>}
   */
  getResult () {
    return this.ancestorResult.concat(this.oldResult.concat(this.newResult))
  }

  check (master, slave) {
    let mergeable = true
    master.getNodes().forEach(node => {
      if (!node.getProxy().getMergeable(slave)) {
        mergeable = false
        node.getProxy().setMergeResult(false)
        node.getProxy().setMatchResult(false)
      } else {
        node.getProxy().setMergeResult(true)
        node.getProxy().setMatchResult(!!node.getProxy().getMatched(slave))
      }
    })
    return mergeable
  }

  scan () {
    let masterOps = this.masterSrc.operations
    let slaveOps = this.slaveSrc.operations
    let ancestor = new Swc(this.masterSrc.sourceStr, 0x0)
    this.ancestorResult = []
    let len = masterOps.length > slaveOps.length ? slaveOps.length : masterOps.length
    let i = 0
    for (; i < len; i++) {
      if (masterOps[i].equal(slaveOps[i])) {
        this.proxy.from(masterOps[i].toString(), ancestor)
        this.ancestorResult.push(masterOps[i])
      } else
        break
    }
    this.master = new Swc(ancestor.serialize(), 0x0)
    this.slave = new Swc(ancestor.serialize(), 0x0)
    for (let j = i; j < masterOps.length; j++) {
      this.proxy.from(masterOps[j].toString(), this.master)
    }
    for (let j = i; j < slaveOps.length; j++) {
      this.proxy.from(slaveOps[j].toString(), this.slave)
    }
  }

  /**
   *
   * @param {Swc} master
   * @param {Swc} slave
   * @return {{ops: Array.<NodeOperation>, oldOps: Map.<Number, NodeOperation>, newOps: Map.<Number, NodeOperation>, newEPOps: Map.<Number, NodeOperation>}}
   */
  initialize (master, slave) {
    let ops = this.proxy.compress(master)
    let oldOps = new Map()
    let newOps = new Map()
    let newEPOps = new Map()
    console.log('------------------------')
    console.log(ops.map(op => op.toString()).join('\n'))
    ops.forEach(op => {
      if (op instanceof Interpolate) {
        newOps.set(op.getTarget().index, op)
      } else if (op instanceof EditParent) {
        newEPOps.set(op.getTarget().index, op)
      } else {
        oldOps.set(op.getTarget().index, op)
      }
    })
    master.getNodes().forEach(node => {
      if (!newOps.has(node.index) && !oldOps.has(node.index) && !newEPOps.has(node.index)) {
        node.getProxy().setMatched(slave, slave.getNodeByIndex(node.index).getProxy())
        node.getProxy().setMergeable(slave, true)
      }
    })

    return { ops: ops, oldOps: oldOps, newOps: newOps, newEPOps: newEPOps }
  }

  mergeOldOps () {
    this.oldResult = []
    let oldNodes = new Set()
    for (let masterIndex of this.oldMasterOps.keys()) {
      oldNodes.add(masterIndex)
    }
    for (let slaveIndex of this.oldSlaveOps.keys()) {
      oldNodes.add(slaveIndex)
    }
    oldNodes.forEach(index => {
      let masterOp = this.oldMasterOps.get(index)
      let slaveOp = this.oldSlaveOps.get(index)

      if (masterOp && !slaveOp) {
        // console.log(masterOp.toString())
        if (masterOp instanceof Edit) {
          masterOp.getTarget().getProxy().setMergeable(this.slave, true)
          masterOp.getTarget().getProxy().setMatched(this.slave, null)
        } else {
          this.slave.getNodeByIndex(index).getProxy().setDelete()
        }
        this.oldResult.push(masterOp)
      } else if (!masterOp && slaveOp) {
        // console.log(slaveOp.toString())
        if (slaveOp instanceof Edit) {
          slaveOp.getTarget().getProxy().setMergeable(this.master, true)
          slaveOp.getTarget().getProxy().setMatched(this.master, null)
        } else {
          this.master.getNodeByIndex(index).getProxy().setDelete()
        }
        this.oldResult.push(slaveOp)
      } else if (masterOp && slaveOp) {
        // console.log(masterOp.toString() + ':' + slaveOp.toString())
        if (masterOp.match(slaveOp)) {
          if (masterOp instanceof Edit) {
            masterOp.getTarget().getProxy().setMergeable(this.slave, true)
            masterOp.getTarget().getProxy().setMatched(this.slave, slaveOp.getTarget().getProxy())
            slaveOp.getTarget().getProxy().setMergeable(this.master, true)
            slaveOp.getTarget().getProxy().setMatched(this.master, masterOp.getTarget().getProxy())
          }
          this.oldResult.push(masterOp)
        } else {

        }
      }
    })

  }

  mergeNewOps () {
    this.newResult = []
    let matchOpPairs = []

    // match the closest node pairs
    for (let slaveOp of this.newSlaveOps.values()) {
      for (let masterOp of this.newMasterOps.values()) {
        if (slaveOp.getTarget().distanceTo(masterOp.getTarget()) < 1 && Math.pow(slaveOp.newRadius - masterOp.newRadius, 2) < 1) {
          slaveOp.getTarget().getProxy().setMatched(this.master, masterOp.getTarget().getProxy())
          masterOp.getTarget().getProxy().setMatched(this.slave, slaveOp.getTarget().getProxy())
          matchOpPairs.push([masterOp, slaveOp])
        }
      }
    }

    // merge the matched node pair
    matchOpPairs.forEach(e => {
      let masterOp = e[0]
      let slaveOp = e[1]
      if ((!slaveOp.parent && !masterOp.parent) || (slaveOp.parent && masterOp.parent && slaveOp.parent.getProxy().getMatched(this.master) === masterOp.parent.getProxy())) {
        slaveOp.getTarget().getProxy().setMergeable(this.master, true)
        masterOp.getTarget().getProxy().setMergeable(this.slave, true)

        this.newResult.push(masterOp)
      }
    })

    // merge the master operations which are not matched
    for (let op of this.newMasterOps.values()) {
      if (!op.getTarget().getProxy().getMatched(this.slave)) {
        if (!op.parent || ((op.parent.getProxy().getMergeable(this.slave) || op.parent.getProxy().getMatched(this.slave)) && !op.parent.getProxy().isDelete())) {
          op.getTarget().getProxy().setMergeable(this.slave, true)
          this.newResult.push(op)
        }
      }
    }

    // merge the slave operations which are not matched
    for (let op of this.newSlaveOps.values()) {
      if (!op.getTarget().getProxy().getMatched(this.master)) {
        if (!op.parent || ((op.parent.getProxy().getMergeable(this.master) || op.parent.getProxy().getMatched(this.master)) && !op.parent.getProxy().isDelete())) {
          op.getTarget().getProxy().setMergeable(this.master, true)
          let masterNode
          if (op.parent)
            masterNode = op.parent.getProxy().getMatched(this.master)
          if (masterNode) {
            op.parent = masterNode.node
          }
          this.newResult.push(op)
        }
      }
    }


    this.newResult.sort((a, b) => {
      if (a.getTarget() === b.parent) return -1
      if (b.getTarget() === a.parent) return 1
      return 0
    })

    this.newResult.forEach(op => {
      op.getTarget().index = this.minimalIndex
      this.minimalIndex += 1
    })

  }

  mergeEPOps () {
    let oldNodes = new Set()
    for (let masterIndex of this.oldMasterEPOps.keys()) {
      oldNodes.add(masterIndex)
    }
    for (let slaveIndex of this.oldSlaveEPOps.keys()) {
      oldNodes.add(slaveIndex)
    }
    oldNodes.forEach(index => {
      let masterOp = this.oldMasterEPOps.get(index)
      let slaveOp = this.oldSlaveEPOps.get(index)

      if (masterOp && !slaveOp) {
        // console.log(masterOp.toString())
        masterOp.getTarget().getProxy().setMergeable(this.slave, true)
        masterOp.getTarget().getProxy().setMatched(this.slave, null)
        this.oldResult.push(masterOp)
      } else if (!masterOp && slaveOp) {
        // console.log(slaveOp.toString())
        slaveOp.getTarget().getProxy().setMergeable(this.master, true)
        slaveOp.getTarget().getProxy().setMatched(this.master, null)
        this.oldResult.push(slaveOp)
      } else if (masterOp && slaveOp) {
        // console.log(masterOp.toString() + ':' + slaveOp.toString())
        if (masterOp.match(slaveOp)) {
          masterOp.getTarget().getProxy().setMergeable(this.slave, true)
          masterOp.getTarget().getProxy().setMatched(this.slave, slaveOp.getTarget().getProxy())
          slaveOp.getTarget().getProxy().setMergeable(this.master, true)
          slaveOp.getTarget().getProxy().setMatched(this.master, masterOp.getTarget().getProxy())
          this.oldResult.push(masterOp)
        }
      }
    })

  }
}