/* eslint-env mocha */
import { expect } from 'chai'
import Swc from '../../client/util/swc/Swc'
import { OperationProxy } from '../../client/util/operation/OperationProxy'
import { samples } from './sample/SwcSamples'
import Merger from '../../client/util/resolver/Merger'
import { testData2 } from './sample/TestData2'
import * as THREE from 'three'

describe('Merger Test', () => {
  it('revise test', () => {
    let master = new Swc(samples.source, 0x0)
    let slave = new Swc(samples.source, 0x0)
    let proxy = new OperationProxy()
    proxy.from(samples.ops1, master)
    proxy.from(samples.ops2, slave)
    console.log('--------------operation series of master--------------')
    console.log(samples.ops1)
    console.log('---------------operation series of slave--------------')
    console.log(samples.ops2)
    let merger = new Merger(master, slave)
    console.log('-----------------------merging 1----------------------')
    expect(merger.merge()).to.be.equal(false)
    console.log(merger.getResult().map(op => op.toString()).join('\n'))

    proxy.change('Edit')
    let node3 = master.getNodeByIndex(3)
    proxy.currentOperation.dragStart(node3)
    proxy.currentOperation.drag(node3, new THREE.Vector3(127.833, 874.708, 72.7793))
    proxy.currentOperation.dragEnd(node3)

    let node6 = slave.getNodeByIndex(6)
    proxy.currentOperation.dragStart(node6)
    proxy.currentOperation.drag(node6, new THREE.Vector3(163.863, 801.591, 68.9003))
    proxy.currentOperation.dragEnd(node6)
    console.log('-----------------------merging 2----------------------')
    expect(merger.merge()).to.be.equal(false)
    console.log(merger.getResult().map(op => op.toString()).join('\n'))

    let node12 = slave.getNodeByIndex(12)
    proxy.currentOperation.dragStart(node12)
    proxy.currentOperation.drag(node12, new THREE.Vector3(155.833, 866.708, 72.7793))
    proxy.currentOperation.dragEnd(node12)
    console.log('-----------------------merging 3----------------------')
    // expect(merger.merge()).to.be.equal(true)
    let combinedOperations = merger.getResult().map(op => op.toString()).join('\n')
    let mergedResult = new Swc(master.sourceStr, 0x0)
    proxy.from(combinedOperations, mergedResult)
    console.log(combinedOperations)

    console.log()
  })

  it('dependency test', () => {
    let master = new Swc(testData2.source, 0x0)
    let slave = new Swc(testData2.source, 0x0)
    let proxy = new OperationProxy()
    proxy.from(testData2.ops1, master)
    proxy.from(testData2.ops2, slave)

    console.log('--------------operation series of master--------------')
    console.log(testData2.ops1)
    console.log('---------------operation series of slave--------------')
    console.log(testData2.ops2)
    let merger = new Merger(master, slave)
    console.log('------------------------merging-----------------------')
    expect(merger.merge()).to.be.equal(false)
    console.log(merger.getResult().map(op => op.toString()).join('\n'))
    console.log()
    proxy.change('Delete')
    proxy.currentOperation.dragStart(slave.getNodeByIndex(3))
    proxy.change('DeleteParent')
    proxy.currentOperation.dragStart(slave.getNodeByIndex(8))
    console.log('---------------------merging again--------------------')
    let res = merger.merge()
    console.log(merger.getResult().map(op => op.toString()).join('\n'))
    console.log()
    expect(res).to.be.equal(true)
    let combinedOperations = merger.getResult().map(op => op.toString()).join('\n')
    let mergedResult = new Swc(master.sourceStr, 0x0)
    proxy.from(combinedOperations, mergedResult)
  })

  it('compression test', () => {
    let master = new Swc(testData2.source, 0x0)
    let slave = new Swc(testData2.source, 0x0)
    let proxy = new OperationProxy()
    proxy.from(testData2.ops1, master)
    proxy.from(testData2.ops2, slave)

    console.log(testData2.ops2)
    proxy.change('Delete')
    proxy.currentOperation.dragStart(slave.getNodeByIndex(3))
    proxy.change('DeleteParent')
    proxy.currentOperation.dragStart(slave.getNodeByIndex(5))
    console.log('--------------------compress slave-------------------')
    proxy.compress(slave).forEach(op => console.log(op.toString()))
    console.log('--------------------compress master-------------------')
    proxy.compress(master).forEach(op => console.log(op.toString()))
    console.log()
  })

  it('edit parent test', () => {
    let master = new Swc(testData2.source, 0x0)
    let slave = new Swc(testData2.source, 0x0)
    let proxy = new OperationProxy()
    proxy.from(testData2.ops1, master)
    proxy.from(testData2.ops2, slave)

    let merger = new Merger(master, slave)
    console.log('------------------------merging-----------------------')
    proxy.change('Delete')
    proxy.currentOperation.dragStart(slave.getNodeByIndex(3))
    expect(merger.merge()).to.be.equal(true)
    console.log(merger.getResult().map(op => op.toString()).join('\n'))
    console.log('---------------------merging again--------------------')
    proxy.change('DeleteParent')
    proxy.currentOperation.dragStart(slave.getNodeByIndex(5))
    proxy.currentOperation.dragStart(master.getNodeByIndex(5))
    expect(merger.merge()).to.be.equal(true)
    console.log(merger.getResult().map(op => op.toString()).join('\n'))
  })
})
