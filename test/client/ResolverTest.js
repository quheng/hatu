/* eslint-env mocha */
import Resolver from '../../client/util/resolver/Resolver'
import * as fs from 'fs'
import Swc from '../../client/util/swc/Swc'
import { OperationProxy } from '../../client/util/operation/OperationProxy'

describe('KdTree Test', function () {
  it('KdTree create', function () {
    let test = fs.readFileSync('test/client/slice_test.swc', 'utf-8').trim()
    let adjust = fs.readFileSync('test/client/slice_adjust.swc', 'utf-8').trim()
    let resolver = new Resolver(new Swc(test, 0x0), new Swc(adjust,0x0), null)

    let proxy = new OperationProxy()
    proxy.setupOperation()
    let node = resolver.getSwcs()[0].getNodes()[1]
    proxy.currentOperation.dragStart(node)
    proxy.currentOperation.drag(node, node.position.clone().setX(node.position.x + 10))
    proxy.currentOperation.dragEnd(node)
  })
})
