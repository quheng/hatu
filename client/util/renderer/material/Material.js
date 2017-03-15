const THREE = require('three')

// color array, nodes of type 0 show as first color, etc.
export const colors = [
  0x999999,
  0x3919cb,
  0x7d0bc4,
  0xff6700,
  0x3eef00,
  0xffce00,
  0xf50027,
  0x606060
]

export const annotationColor = 0x111111

// set up colors and materials based on color array
export const threeColors = []
export const threeMaterials = []
colors.forEach(
    color => {
      threeColors.push(new THREE.Color(color))
      threeMaterials.push(new THREE.MeshPhongMaterial({ color: color, specular: color }))
    }
)
export const annotationMaterial = new THREE.MeshBasicMaterial({ color: annotationColor })
