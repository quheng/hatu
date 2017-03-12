'use strict'
const THREE = require('three')

import TrackballControls from './control/TrackballControls'
import { DRAG_NODE_MODE_EVENT, OperationProxy, DRAG_EDGE_MODE_EVENT } from './operation/OperationProxy'
import KeyControls from './control/KeyControls'
import HatuOrthographicCamera from './control/HatuOrthographicCamera'
import HatuGUI from './control/HatuGUI'
import DragControls from './control/DragControls'

export default class HatuViewer {

  /**
   *
   * @param container
   * @param {Swc} swc
   * @param {Slices} slices
   */
  constructor (container, swc, slices) {
    this.container = container
    this.swc = swc

    this.HEIGHT = container.offsetHeight
    this.WIDTH = container.offsetWidth
    this.LEFT = container.offsetLeft
    this.TOP = container.offsetTop

    this.boundingBox = this.swc.boundingBox
    this.centerNode = this.swc.centerNode
    this.center = this.swc.center

    this.slices = slices
    this.slices.viewer = this

    this.renderer = this.setUpRenderer()

    this.scene = new THREE.Scene()
    this.scene.add(slices.object)

    this.camera = this.setupOrthographicCamera()

    this.controls = this.setupControl()

    this.operationProxy = this.setupOperationProxy()

    this.keyControls = this.setupKeyControl()

    this.gui = this.setupGUI()

    this.scene.add(this.swc)

    this.light = new THREE.DirectionalLight(0xffffff)
    this.scene.add(this.light)

    this.dragControls = this.setupDragControl()
  }

  exportSwc () {

  }

  setPerspectiveCamera () {
    let cameraPosition = this.camera.position
    this.fov = 45
    this.camera = new THREE.PerspectiveCamera(this.fov, this.WIDTH / this.HEIGHT, 1, this.calculateCameraPosition(this.fov) * 5)
    this.camera.position.copy(cameraPosition)

    this.controls.object = this.camera
  }

  setupOrthographicCamera () {
    let camera = new HatuOrthographicCamera(this.boundingBox, this.calculateCameraPosition() * 5, this)
    camera.position.z = this.calculateCameraPosition()
    return camera
  }

  setupControl () {
    let controls = new TrackballControls(this.camera, this.renderer.domElement)
    controls.noRotate = true
    controls.staticMoving = true
    controls.noRotate = true
    controls.staticMoving = true
    controls.addEventListener('change', this.render.bind(this))
    controls.addEventListener('change', this.slices.notify)
    controls.addEventListener('zoom', this.slices.notify)
    return controls
  }

  setupKeyControl () {
    let keyControls = new KeyControls()
    keyControls.addKeyListener('Ctrl+90', m => {
      m.event.preventDefault()
      this.operationProxy.undo()
    })

    keyControls.addKeyListener('Ctrl+89', m => {
      m.event.preventDefault()
      this.operationProxy.redo()
    })

    return keyControls
  }

  setupDragControl () {
    let scope = this
    let dragControls = new DragControls(this, this.renderer.domElement)
    dragControls.addEventListener('dragstart', event => {
      scope.controls.enabled = false
      scope.operationProxy.currentOperation.dragStart(event.object)
    })
    dragControls.addEventListener('drag', event => {
      scope.controls.enabled = true
      scope.operationProxy.currentOperation.drag(event.object, event.position)
    })
    dragControls.addEventListener('dragend', event => {
      scope.controls.enabled = true
      scope.operationProxy.currentOperation.dragEnd(event.object)
    })
    dragControls.addEventListener('hoveron', event => {
      scope.operationProxy.currentOperation.hoverOn(event.object)
    })
    dragControls.addEventListener('hoveroff', event => {
      scope.operationProxy.currentOperation.hoverOff(event.object)
    })
    dragControls.addEventListener('clicknothing', event => {
      scope.operationProxy.currentOperation.clickNothing(event.position)
    })
    return dragControls
  }

  /**
   *
   * @return {OperationProxy}
   */
  setupOperationProxy () {
    let proxy = new OperationProxy()
    let self = this
    proxy.addEventListener(DRAG_NODE_MODE_EVENT, () => {
      self.dragControls.mode = 'node'
    })
    proxy.addEventListener(DRAG_EDGE_MODE_EVENT, () => {
      self.dragControls.mode = 'edge'
    })
    return proxy
  }

  setupGUI () {
    let self = this
    let gui = new HatuGUI(this.slices.maxElevation, this)
    gui.onElevationChange(elevation => {
      self.slices.setElevation(elevation)
      self.slices.notify()
      this.gui.visualMode = 'slices'
      this.gui.update()
      if (this.camera instanceof HatuOrthographicCamera) {
        this.camera.set(elevation)
      }
    })

    gui.onVisualModeChange(mode => {
      switch (mode) {
        case 'whole':
          self.slices.setElevation(0)
          self.slices.notify()
          this.camera.reset()
          break
        case 'slices':
          if (this.camera instanceof HatuOrthographicCamera) {
            this.camera.set(this.gui.elevation)
            self.slices.notify()
          }
          break
      }
    })

    gui.onNeuronModeChange(mode => {
      this.swc.edgeMode(mode)
    })
    return gui
  }

  // calculates camera position based on bounding box
  calculateCameraPosition () {
    return this.boundingBox.zmax * 2 + 1000
  }

  // sets up renderer
  setUpRenderer () {
    let renderer = new THREE.WebGLRenderer({
      antialias: true   // to get smoother output
    })
    renderer.setClearColor(0xffffff, 1)
    renderer.setSize(this.WIDTH, this.HEIGHT)
    renderer.setPixelRatio(window.devicePixelRatio)
    this.container.appendChild(renderer.domElement)
    return renderer
  }

  render () {
    // actually render the scene
    this.renderer.render(this.scene, this.camera)
  }

  // animation loop
  animate () {
    // loop on request animation loop
    window.requestAnimationFrame(this.animate.bind(this))
    this.controls.update()
    let p = this.camera.position
    this.light.position.set(p.x, p.y, p.z)
    this.render()
  }

  getWindow () {
    let camera = this.camera
    return {
      left: camera.position.x + camera.left + this.center[0],
      right: camera.position.x + camera.right + this.center[0],
      top: camera.position.y + camera.top + this.center[1],
      bottom: camera.position.y + camera.bottom + this.center[1]
    }
  }

}
