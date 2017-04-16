import Swc from "../../../client/util/swc/Swc"
import { OperationProxy } from "../../../client/util/operation/OperationProxy"

let swc = new Swc('1 0 101.851 919.604 69.4822 10.9438 -1', 0x0)
let proxy = new OperationProxy()
proxy.setupOperation()

let position = swc.nodes[0].position.clone()

position.setY(position.y - 40)
swc.addBranch(swc.nodes[0], position)

position.setX(position.x - 10)
position.setY(position.y - 40)
swc.addBranch(swc.nodes[1], position)

position = swc.nodes[0].position.clone()
position.setX(position.x + 20)
position.setY(position.y - 20)

swc.addBranch(swc.nodes[0], position)

let masterStr = swc.serialize()
let normalUser = new Swc(masterStr, 0x0)
position = normalUser.nodes[1].position.clone()
position.setX(position.x + 20)
position.setY(position.y - 40)
normalUser.addBranch(swc.nodes[1], position)
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