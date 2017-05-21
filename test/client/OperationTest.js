import { expect } from 'chai'
import Swc from '../../client/util/swc/Swc'
import { OperationProxy } from '../../client/util/operation/OperationProxy'
import * as THREE from 'three'

describe('Operation Test', () => {
  let data =
    '1 0 101.851 919.604 69.4822 40.9438 -1\n\
2 2 88 1001 58.2734 31.4832 1\n\
3 0 135.833 871.708 72.7793 16.2728 1\n\
4 0 154.389 836.847 71.7563 10.252 3\n\
5 0 165.232 809.066 70.3776 10.5368 4\n\
6 0 172.863 796.591 68.9003 9.46242 5\n\
7 0 180.455 790.135 68.1325 5.09242 6\n\
8 0 188.058 783.684 67.7072 3.55177 7\n\
9 0 195.161 776.67 67.6148 3.46301 8\n\
10 0 202.824 770.331 67.5101 4.14233 9'

  it('Operation Arrow drag test', () => {
    let swc = new Swc(data, 0x0)

    console.log(data)

    let proxy = new OperationProxy()
    proxy.setupOperation()
    swc.nodes.slice(2, 6).forEach(node => {
      proxy.currentOperation.dragStart(node)
      proxy.currentOperation.drag(node, node.position.clone().setX(node.position.x + 10))
      proxy.currentOperation.dragEnd(node)
    })

    let node
    proxy.change('AddBranch')
    node = swc.nodes[2]
    let add = proxy.currentOperation
    proxy.currentOperation.dragStart(node)
    proxy.currentOperation.clickNothing(new THREE.Vector3(node.x + 20, node.y - 10, node.z))

    proxy.change('AddNode')

    let edge = node.childrenNode.get(add.target)
    proxy.currentOperation.dragStart(edge.cylinder)

    proxy.change('Delete')
    proxy.currentOperation.dragStart(swc.nodes[4])

    proxy.change('AddBranch')
    node = add.target
    proxy.currentOperation.dragStart(node)
    proxy.currentOperation.clickNothing(new THREE.Vector3(node.x + 20, node.y - 10, node.z))

    let addBranch = proxy.currentOperation
    proxy.currentOperation.dragStart(node)
    proxy.currentOperation.clickNothing(new THREE.Vector3(node.x + 40, node.y - 10, node.z))

    proxy.change('Edit')
    proxy.currentOperation.dragStart(node)
    proxy.currentOperation.drag(node, new THREE.Vector3(node.x + 4, node.y - 1, node.z + 0.5))
    proxy.currentOperation.dragEnd(node)

    proxy.change('Delete')
    proxy.currentOperation.dragStart(node)

    proxy.change('Edit')
    proxy.currentOperation.dragStart(addBranch.target)
    proxy.currentOperation.mode = 'radius'
    proxy.currentOperation['radius'] = 14
    proxy.currentOperation.edit()

    proxy.currentOperation.dragStart(addBranch.target)
    proxy.currentOperation.mode = 'x'
    proxy.currentOperation['x'] = 207
    proxy.currentOperation.edit()

    proxy.change('AddBranch')

    node = swc.nodes[6]
    let tmpParent = node
    addBranch = proxy.currentOperation
    proxy.currentOperation.dragStart(node)
    proxy.currentOperation.clickNothing(new THREE.Vector3(node.x + 20, node.y - 10, node.z))

    node = addBranch.target
    proxy.currentOperation.dragStart(node)
    proxy.currentOperation.clickNothing(new THREE.Vector3(node.x + 10, node.y - 10, node.z))

    proxy.currentOperation.dragStart(node)
    proxy.currentOperation.clickNothing(new THREE.Vector3(node.x + 12, node.y - 11, node.z))

    proxy.currentOperation.dragStart(node)
    proxy.currentOperation.clickNothing(new THREE.Vector3(node.x + 14, node.y - 12, node.z))

    proxy.change('AddNode')
    edge = tmpParent.childrenNode.get(node)
    proxy.currentOperation.dragStart(edge.cylinder)

    proxy.change('Delete')
    proxy.currentOperation.dragStart(node)

    console.log('-------------------operations-------------------')

    let ops = swc.operations.map(op => op.toString()).join('\n')
    console.log(ops)

    console.log('--------------------compress--------------------')

    let comOps = proxy.compress(swc).map(op => op.toString()).join('\n')
    console.log(comOps)

    console.log('----------------------swc-----------------------')

    console.log(swc.serialize())

    proxy = new OperationProxy()
    swc = new Swc(data, 0x0)
    proxy.from(ops, swc)

    let comSwc = new Swc(data, 0x0)
    proxy.from(comOps, comSwc)

    expect(swc.serialize()).to.be.equal(comSwc.serialize())
  })
})
