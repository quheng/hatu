/* eslint-env mocha */
import Resolver from '../../client/util/resolver/Resolver'
import * as fs from 'fs'
import { OperationProxy } from '../../client/util/operation/OperationProxy'
import Swc from '../../client/util/swc/Swc'
import { expect } from 'chai'

describe('Resolver Test', function () {
  it('Match test', function () {
    let test = fs.readFileSync('test/client/res/slice_test.swc', 'utf-8').trim()
    let proxy = new OperationProxy()
    proxy.setupOperation()

    let swc = new Swc(test, 0x0)
    swc.nodes.slice(2, 6).forEach(node => {
      proxy.currentOperation.dragStart(node)
      proxy.currentOperation.drag(node, node.position.clone().setX(node.position.x + 40))
      proxy.currentOperation.dragEnd(node)
    })
    for (let i = 0; i < 2; i++) {
      let node = swc.nodes[swc.nodes.length - 1]
      let position = node.position.clone()
      position.setX(position.x + 10)
      position.setY(position.y - 40)
      swc.addBranch(node, position)
    }
    let adjusted = swc.serialize()

    let resolver = new Resolver(test, adjusted, null, test)

    expect(resolver.match()).to.be.equal(true)
  })
})
