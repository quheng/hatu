/* eslint-env mocha */
import { expect } from 'chai'
import KdTree from '../../client/util/swc/KdTree'

describe('KdTree Test', function () {
  it('KdTree create', function () {
    const points = [
      { x: 1, y: 2 },
      { x: 3, y: 4 },
      { x: 5, y: 6 },
      { x: 7, y: 8 }
    ]

    const distance = (a, b) => {
      return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2)
    }

    let tree = new KdTree(points, distance, ['x', 'y'])
    const nearest = tree.nearest({ x: 5, y: 5 }, 1)
    expect(nearest.toString()).to.be.equal([[{ x: 5, y: 6 }, 1]].toString())

    let point = { x: 10, y: 20 }
    tree.insert(point)
    console.log(tree.nearest({ x: 10, y: 15 }, 2))
    tree.remove(point)
    console.log(tree.nearest({ x: 10, y: 15 }, 2))

    tree.iterate(node => {
      console.log(node)
    })
  })
})
