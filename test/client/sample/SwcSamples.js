import Swc from '../../../client/util/swc/Swc'
import { OperationProxy } from '../../../client/util/operation/OperationProxy'

let mSwc = new Swc('1 0 101.851 919.604 69.4822 10.9438 -1', 0x0)
let proxy = new OperationProxy()
proxy.setupOperation()

let mPosition = mSwc.nodes[0].position.clone()

mPosition.setY(mPosition.y - 40)
mSwc.addBranch(mSwc.nodes[0], mPosition)

mPosition.setX(mPosition.x - 10)
mPosition.setY(mPosition.y - 40)
mSwc.addBranch(mSwc.nodes[1], mPosition)

mPosition = mSwc.nodes[0].position.clone()
mPosition.setX(mPosition.x + 20)
mPosition.setY(mPosition.y - 20)

mSwc.addBranch(mSwc.nodes[0], mPosition)

let masterStr = mSwc.serialize()
let normalUser = new Swc(masterStr, 0x0)
mPosition = normalUser.nodes[1].position.clone()
mPosition.setX(mPosition.x + 20)
mPosition.setY(mPosition.y - 40)
normalUser.addBranch(mSwc.nodes[1], mPosition)
let normalStr = normalUser.serialize()

export let samples = {
  master: masterStr,
  normalUser: normalStr
}

/**
 *
 * @param {Swc} swc
 * @return {String}
 */
export function modify (swc) {
  let proxy = new OperationProxy()
  proxy.setupOperation()
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

  return swc.serialize()
}
