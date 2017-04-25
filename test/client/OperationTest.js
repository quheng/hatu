import { expect } from 'chai'
import * as fs from 'fs'
import Swc from '../../client/util/swc/Swc'
import { OperationProxy } from '../../client/util/operation/OperationProxy'
import * as THREE from 'three'

describe('Operation Test', () => {
  let data = fs.readFileSync('test/client/res/slice_test.swc', 'utf-8').trim()

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

    swc.operations.forEach(op => console.log(op.toString()))

    console.log('--------------------compress--------------------')

    proxy.compress(swc).forEach(op => console.log(op.toString()))

    console.log('----------------------swc-----------------------')

    console.log(swc.serialize())
  })
})
