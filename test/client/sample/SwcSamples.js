import Swc from '../../../client/util/swc/Swc'
import { OperationProxy } from '../../../client/util/operation/OperationProxy'

let source =
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

let ops1 =
  'Edit 3 (125.833,871.708,72.7793) 16.2728\n\
Edit 4 (164.389,836.847,71.7563) 10.252\n\
Delete 5\n\
Edit 6 (163.863,801.591,68.9003) 9.46242\n\
Interpolate 12 3 () (155.833,866.708,72.7793) 3.520055\n\
Interpolate 13 12 () (185.833,851.708,72.7793) 3.520055\n\
Interpolate 14 12 () (207,851.708,72.7793) 4\n\
Interpolate 16 8 () (209.058,784.684,67.7072) 3.520055\n\
Interpolate 17 16 () (213.058,757.684,67.7072) 3.520055\n\
Interpolate 18 16 () (220.058,762.684,67.7072) 3.520055\n\
Interpolate 19 16 () (225.058,772.684,67.7072) 3.520055'

let ops2 =
  'Edit 3 (127.833,874.708,72.7793) 16.2728\n\
Edit 4 (164.389,836.847,71.7563) 10.252\n\
Delete 5\n\
Edit 6 (165.863,800.591,68.9003) 9.46242\n\
Interpolate 12 3 () (157.833,865.708,72.7793) 3.520055\n\
Interpolate 13 12 () (185.833,851.708,72.7793) 3.520055\n\
Interpolate 14 12 () (207,851.708,72.7793) 4\n\
Interpolate 19 8 () (209.058,784.684,67.7072) 3.520055\n\
Interpolate 16 19 () (213.058,757.684,67.7072) 3.520055\n\
Interpolate 17 19 () (220.058,762.684,67.7072) 3.520055\n\
Interpolate 18 19 () (225.058,772.684,67.7072) 3.520055'

let mSwc = new Swc('1 0 101.851 919.604 69.4822 10.9438 -1', 0x0)
let mProxy = new OperationProxy()
mProxy.setupOperation()

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
  source: source,
  ops1: ops1,
  ops2: ops2
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
