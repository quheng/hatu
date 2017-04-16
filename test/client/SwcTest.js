/* eslint-env mocha */
import { expect } from 'chai'
import * as fs from 'fs'
import Swc from '../../client/util/swc/Swc'
import { OperationProxy } from '../../client/util/operation/OperationProxy'

describe('Swc Test', () => {
  let data = fs.readFileSync('test/client/res/slice_test.swc', 'utf-8').trim()

  it('Swc deserialization and serialization', () => {
    let swc = new Swc(data, 0x0)
    let proxy = new OperationProxy()
    proxy.setupOperation()
    let res = swc.serialize()
    expect(data).to.be.equal(res.trim())
  })

  it('Operation Arrow drag test', () => {
    let swc = new Swc(data, 0x0)
    let proxy = new OperationProxy()
    proxy.setupOperation()
    swc.nodes.slice(2, 6).forEach(node => {
      proxy.currentOperation.dragStart(node)
      proxy.currentOperation.drag(node, node.position.clone().setX(node.position.x + 10))
      proxy.currentOperation.dragEnd(node)
    })

    swc.nodes.slice(2, 6).forEach(node => {
      proxy.currentOperation.dragStart(node)
      proxy.currentOperation.drag(node, node.position.clone().setX(node.position.x - 10))
      proxy.currentOperation.dragEnd(node)
    })
    expect(data.trim()).to.be.equal(swc.serialize().trim())
    swc.nodes.slice(2, 6).forEach(node => {
      proxy.currentOperation.dragStart(node)
      proxy.currentOperation.drag(node, node.position.clone().setX(node.position.x + 10))
      proxy.currentOperation.dragEnd(node)
    })
    let conductResult = swc.serialize().trim()
    for (let i = 0; i < 4; i++) {
      proxy.undo()
    }
    expect(data).to.be.equal(swc.serialize().trim())
    for (let i = 0; i < 4; i++) {
      proxy.redo()
    }
    expect(swc.serialize().trim()).to.be.equal(conductResult)
  })

  it('Operation Arrow edit test', () => {
    let swc = new Swc(data, 0x0)
    let proxy = new OperationProxy()
    proxy.setupOperation()
    function edit (name, target) {
      proxy.currentOperation.mode = name
      proxy.currentOperation[name] = target
      proxy.currentOperation.edit()
    }

    proxy.currentOperation.dragStart(swc.nodes[4])
    edit('radius', 40)
    edit('x', 40)
    proxy.currentOperation.dragStart(swc.nodes[3])
    edit('y', 40)
    edit('z', 410)
    let conductResult = swc.serialize().trim()
    for (let i = 0; i < 4; i++) {
      proxy.undo()
    }
    expect(data).to.be.equal(swc.serialize().trim())
    for (let i = 0; i < 4; i++) {
      proxy.redo()
    }
    expect(swc.serialize().trim()).to.be.equal(conductResult)
  })

  it('Swc KdTree integrate', () => {
    let swc = new Swc(data)
    expect(swc.nodes[1].toString()).to.be.equal(swc.nearest(swc.nodes[1]).toString())
  })
})
