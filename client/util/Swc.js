export default class Swc extends Array {

  constructor (swcFile) {
    super()
    if (swcFile) {
      this.centerNode = 1
      let splittedLine = swcFile.replace(/\r\n/g, '\n').split('\n')

      let floatReg = '-?\\d*(?:\\.\\d+)?'
      let positiveIntReg = '\\d+'
      let pattern = new RegExp('^[ \\t]*(' + [
        positiveIntReg,                // index
        positiveIntReg,                // type
        floatReg,                      // x
        floatReg,                      // y
        floatReg,                      // z
        floatReg,                      // radius
        '-1|' + positiveIntReg         // parent
      ].join(')[ \\t]+(') + ')[ \\t]*$')

      splittedLine.forEach(line => {
        let match = line.match(pattern)
        if (match) {
          let index = parseInt(match[1])
          let type = parseInt(match[2])
          let x = parseFloat(match[3])
          let y = parseFloat(match[4])
          let z = parseFloat(match[5])
          let radius = parseFloat(match[6])
          let parent = parseFloat(match[7])
          this[index] = ({
            'index': index,
            'type': type,
            'x': x,
            'y': y,
            'z': z,
            'radius': radius,
            'parent': parent
          })
          if (parent === -1) {
            this.root = index
          }
        } else {
          if (line[0] !== '#' && line !== '') {
            throw new Error('swc format error at lien: ' + line)
          }
        }
      })
    }

    this.avgRadii = () => {
      let radiiSum = 0
      let radiiCount = 0
      this.forEach(node => {
        radiiSum += node.radius
        radiiCount++
      })
      return radiiSum / radiiCount
    }

    // calculates bounding box for neuron object
    this.calculateBoundingBox = () => {
      let boundingBox = {
        'xmin': this[this.centerNode].x,
        'xmax': this[this.centerNode].x,
        'ymin': this[this.centerNode].y,
        'ymax': this[this.centerNode].y,
        'zmin': this[this.centerNode].z,
        'zmax': this[this.centerNode].z
      }
      this.forEach(node => {
        if (node.x < boundingBox.xmin) boundingBox.xmin = node.x
        if (node.x > boundingBox.xmax) boundingBox.xmax = node.x
        if (node.y < boundingBox.ymin) boundingBox.ymin = node.y
        if (node.y > boundingBox.ymax) boundingBox.ymax = node.y
        if (node.z < boundingBox.zmin) boundingBox.zmin = node.z
        if (node.z > boundingBox.zmax) boundingBox.zmax = node.z
      })
      this.boundingBox = boundingBox
      return this.boundingBox
    }
  }

}
