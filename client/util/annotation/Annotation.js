import * as THREE from 'three'
import ChooseBox from './ChooseBox'

export default class Annotation extends THREE.Object3D {

  openChooseBox () {
    this.chooseBox = new ChooseBox()
    super.add(this.chooseBox)
  }

  /**
   *
   * @param {Vector3} position1
   * @param {Vector3} position2
   */
  updateChooseBox (position1, position2) {
    this.chooseBox.notify(position1, position2)
  }

  closeChooseBox () {
    super.remove(this.chooseBox)
  }
}
