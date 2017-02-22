'use strict'
import * as THREE from 'three'

export default class KeyControls extends THREE.EventDispatcher {

  constructor () {
    super()
    let scope = this
    document.addEventListener('keydown', e => {
      // e.preventDefault()
      scope.dispatchEvent({ type: `${e.ctrlKey ? 'Ctrl' : ''}+${e.keyCode}` })
    }, false)
  }

  /**
   *
   * @param {string} keyCode
   * @param {Function} listener
   */
  addKeyListener (keyCode, listener) {
    this.addEventListener(keyCode, listener)
  }
}
