class Node {
  constructor (obj, dimension, parent) {
    this.obj = obj
    this.left = null
    this.right = null
    this.parent = parent
    this.dimension = dimension
  }
}

export default class KdTree {
  constructor (points, metric, dimensions) {
    let self = this

    this.points = points
    this.metric = metric
    this.dimensions = dimensions

    function buildTree (points, depth, parent) {
      let dim = depth % dimensions.length
      let median
      let node

      if (points.length === 0) {
        return null
      }
      if (points.length === 1) {
        return new Node(points[0], dim, parent)
      }

      points.sort(function (a, b) {
        return a[dimensions[dim]] - b[dimensions[dim]]
      })

      median = Math.floor(points.length / 2)
      node = new Node(points[median], dim, parent)
      node.left = buildTree(points.slice(0, median), depth + 1, node)
      node.right = buildTree(points.slice(median + 1), depth + 1, node)

      return node
    }

    // Reloads a serialized tree
    function loadTree (data) {
      // Just need to restore the `parent` parameter
      self.root = data

      function restoreParent (root) {
        if (root.left) {
          root.left.parent = root
          restoreParent(root.left)
        }

        if (root.right) {
          root.right.parent = root
          restoreParent(root.right)
        }
      }

      restoreParent(self.root)
    }

    // If points is not an array, assume we're loading a pre-built tree
    if (!Array.isArray(points)) loadTree(points, metric, dimensions)
    else this.root = buildTree(points, 0, null)
  }

  // Convert to a JSON serializable structure; this just requires removing
  // the `parent` property

  toJSON (src) {
    if (!src) src = this.root
    let dest = new Node(src.obj, src.dimension, null)
    if (src.left) dest.left = this.toJSON(src.left)
    if (src.right) dest.right = this.toJSON(src.right)
    return dest
  }

  iterate (action) {
    function innerIterate (node) {
      if (node === null) {
        return
      } else {
        action(node.obj)
      }
      innerIterate(node.left)
      innerIterate(node.right)
    }

    innerIterate(this.root)
  }

  insert (point) {
    let self = this

    function innerSearch (node, parent) {
      if (node === null) {
        return parent
      }

      let dimension = self.dimensions[node.dimension]
      if (point[dimension] < node.obj[dimension]) {
        return innerSearch(node.left, node)
      } else {
        return innerSearch(node.right, node)
      }
    }

    let insertPosition = innerSearch(this.root, null)
    let newNode
    let dimension

    if (insertPosition === null) {
      this.root = new Node(point, 0, null)
      return
    }

    newNode = new Node(point, (insertPosition.dimension + 1) % this.dimensions.length, insertPosition)
    dimension = this.dimensions[insertPosition.dimension]

    if (point[dimension] < insertPosition.obj[dimension]) {
      insertPosition.left = newNode
    } else {
      insertPosition.right = newNode
    }
  }

  remove (point) {
    let node

    let self = this

    function nodeSearch (node) {
      if (node === null) {
        return null
      }

      if (node.obj === point) {
        return node
      }

      let dimension = self.dimensions[node.dimension]

      if (point[dimension] < node.obj[dimension]) {
        return nodeSearch(node.left, node)
      } else {
        return nodeSearch(node.right, node)
      }
    }

    function removeNode (node) {
      let nextNode,
        nextObj,
        pDimension

      function findMin (node, dim) {
        let dimension,
          own,
          left,
          right,
          min

        if (node === null) {
          return null
        }

        dimension = self.dimensions[dim]

        if (node.dimension === dim) {
          if (node.left !== null) {
            return findMin(node.left, dim)
          }
          return node
        }

        own = node.obj[dimension]
        left = findMin(node.left, dim)
        right = findMin(node.right, dim)
        min = node

        if (left !== null && left.obj[dimension] < own) {
          min = left
        }
        if (right !== null && right.obj[dimension] < min.obj[dimension]) {
          min = right
        }
        return min
      }

      if (node.left === null && node.right === null) {
        if (node.parent === null) {
          self.root = null
          return
        }

        pDimension = self.dimensions[node.parent.dimension]

        if (node.obj[pDimension] < node.parent.obj[pDimension]) {
          node.parent.left = null
        } else {
          node.parent.right = null
        }
        return
      }

      // If the right subtree is not empty, swap with the minimum element on the
      // node's dimension. If it is empty, we swap the left and right subtrees and
      // do the same.
      if (node.right !== null) {
        nextNode = findMin(node.right, node.dimension)
        nextObj = nextNode.obj
        removeNode(nextNode)
        node.obj = nextObj
      } else {
        nextNode = findMin(node.left, node.dimension)
        nextObj = nextNode.obj
        removeNode(nextNode)
        node.right = node.left
        node.left = null
        node.obj = nextObj
      }
    }

    node = nodeSearch(self.root)

    if (node === null) {
      return
    }

    removeNode(node)
  };

  nearest (point, maxNodes, maxDistance) {
    let i
    let result
    let bestNodes
    let self = this

    bestNodes = new BinaryHeap(
      function (e) {
        return -e[1]
      }
    )

    function nearestSearch (node) {
      let bestChild
      let dimension = self.dimensions[node.dimension]
      let ownDistance = self.metric(point, node.obj)
      let linearPoint = {}
      let linearDistance
      let otherChild
      let i

      function saveNode (node, distance) {
        bestNodes.push([node, distance])
        if (bestNodes.size() > maxNodes) {
          bestNodes.pop()
        }
      }

      for (i = 0; i < self.dimensions.length; i += 1) {
        if (i === node.dimension) {
          linearPoint[self.dimensions[i]] = point[self.dimensions[i]]
        } else {
          linearPoint[self.dimensions[i]] = node.obj[self.dimensions[i]]
        }
      }

      linearDistance = self.metric(linearPoint, node.obj)

      if (node.right === null && node.left === null) {
        if (bestNodes.size() < maxNodes || ownDistance < bestNodes.peek()[1]) {
          saveNode(node, ownDistance)
        }
        return
      }

      if (node.right === null) {
        bestChild = node.left
      } else if (node.left === null) {
        bestChild = node.right
      } else {
        if (point[dimension] < node.obj[dimension]) {
          bestChild = node.left
        } else {
          bestChild = node.right
        }
      }

      nearestSearch(bestChild)

      if (bestNodes.size() < maxNodes || ownDistance < bestNodes.peek()[1]) {
        saveNode(node, ownDistance)
      }

      if (bestNodes.size() < maxNodes || Math.abs(linearDistance) < bestNodes.peek()[1]) {
        if (bestChild === node.left) {
          otherChild = node.right
        } else {
          otherChild = node.left
        }
        if (otherChild !== null) {
          nearestSearch(otherChild)
        }
      }
    }

    if (maxDistance) {
      for (i = 0; i < maxNodes; i += 1) {
        bestNodes.push([null, maxDistance])
      }
    }

    if (this.root) {
      nearestSearch(this.root)
    }

    result = []

    for (i = 0; i < Math.min(maxNodes, bestNodes.content.length); i += 1) {
      if (bestNodes.content[i][0]) {
        result.push([bestNodes.content[i][0].obj, bestNodes.content[i][1]])
      }
    }
    return result
  }

  balanceFactor () {
    function height (node) {
      if (node === null) {
        return 0
      }
      return Math.max(height(node.left), height(node.right)) + 1
    }

    function count (node) {
      if (node === null) {
        return 0
      }
      return count(node.left) + count(node.right) + 1
    }

    return height(this.root) / (Math.log(count(this.root)) / Math.log(2))
  }
}

// Binary heap implementation from:
// http://eloquentjavascript.net/appendix2.html

class BinaryHeap {
  constructor (scoreFunction) {
    this.content = []
    this.scoreFunction = scoreFunction
  }

  push (element) {
    // Add the new element to the end of the array.
    this.content.push(element)
    // Allow it to bubble up.
    this.bubbleUp(this.content.length - 1)
  }

  pop () {
    // Store the first element so we can return it later.
    let result = this.content[0]
    // Get the element at the end of the array.
    let end = this.content.pop()
    // If there are any elements left, put the end element at the
    // start, and let it sink down.
    if (this.content.length > 0) {
      this.content[0] = end
      this.sinkDown(0)
    }
    return result
  }

  peek () {
    return this.content[0]
  }

  remove (node) {
    let len = this.content.length
    // To remove a value, we must search through the array to find
    // it.
    for (let i = 0; i < len; i++) {
      if (this.content[i] === node) {
        // When it is found, the process seen in 'pop' is repeated
        // to fill up the hole.
        let end = this.content.pop()
        if (i !== len - 1) {
          this.content[i] = end
          if (this.scoreFunction(end) < this.scoreFunction(node)) {
            this.bubbleUp(i)
          } else {
            this.sinkDown(i)
          }
        }
        return
      }
    }
    throw new Error('Node not found.')
  }

  size () {
    return this.content.length
  }

  bubbleUp (n) {
    // Fetch the element that has to be moved.
    let element = this.content[n]
    // When at 0, an element can not go up any further.
    while (n > 0) {
      // Compute the parent element's index, and fetch it.
      let parentN = Math.floor((n + 1) / 2) - 1
      let parent = this.content[parentN]
      // Swap the elements if the parent is greater.
      if (this.scoreFunction(element) < this.scoreFunction(parent)) {
        this.content[parentN] = element
        this.content[n] = parent
        // Update 'n' to continue at the new position.
        n = parentN
      } else {
        // Found a parent that is less, no need to move it further.
        break
      }
    }
  }

  sinkDown (n) {
    // Look up the target element and its score.
    let length = this.content.length
    let element = this.content[n]
    let elemScore = this.scoreFunction(element)

    while (true) {
      // Compute the indices of the child elements.
      let child2N = (n + 1) * 2
      let child1N = child2N - 1
      // This is used to store the new position of the element,
      // if any.
      let swap = null
      // If the first child exists (is inside the array)...
      let child1, child1Score
      if (child1N < length) {
        // Look it up and compute its score.
        child1 = this.content[child1N]
        child1Score = this.scoreFunction(child1)
        // If the score is less than our element's, we need to swap.
        if (child1Score < elemScore) {
          swap = child1N
        }
      }
      // Do the same checks for the other child.
      if (child2N < length) {
        let child2 = this.content[child2N]
        let child2Score = this.scoreFunction(child2)
        if (child2Score < (swap == null ? elemScore : child1Score)) {
          swap = child2N
        }
      }

      // If the element needs to be moved, swap it, and continue.
      if (swap != null) {
        this.content[n] = this.content[swap]
        this.content[swap] = element
        n = swap
      } else {
        // Otherwise, we are done.
        break
      }
    }
  }
}

