import * as THREE from 'three'
export default class Volume {
  constructor (slices) {
    this.volume = new THREE.Object3D()
    for (let i = 0; i < slices.length; i++) {
      let geometry = new THREE.PlaneGeometry(1000, 1000)
      let material = new THREE.MeshBasicMaterial({
        map: slices[i],
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 1.0 / slices.length
      })
      let mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(0, 0, (slices.length - i) * 4)
      this.volume.add(mesh)
    }
  }

  getMesh () {
    return this.volume
  }

  static testVolume () {
    let textureLoader = new THREE.TextureLoader()
    let maps = []
    for (let i = 1; i <= 98; i += 4) {
      maps.push(i)
    }
    maps = maps.map(function (i) {
      return '/res/slices/slice15_L11_p' + i + '.jpg'
    })
    maps = maps.map(function (url) {
      return textureLoader.load(url)
    })
    // let map = textureLoader.load('/res/UV_Grid_Sm.jpg')
    return new Volume(maps)
  }
}
