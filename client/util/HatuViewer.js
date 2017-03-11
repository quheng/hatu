'use strict'
const THREE = require('three')

import TrackballControls from "./control/TrackballControls"
import OperationProxy from "./control/OperationProxy"
import KeyControls from "./control/KeyControls"
import HatuOrthographicCamera from "./control/HatuOrthographicCamera"
import HatuGUI from "./control/HatuGUI"
import DragControls from "./control/DragControls"

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

    // initialize bounding box
    this.boundingBox = this.swc.boundingBox
    this.centerNode = this.swc.centerNode
    this.center = this.swc.center
    this.slices = slices
    this.slices.viewer = this

    // setup render
    this.renderer = this.setUpRenderer()

    // create a scene
    this.scene = new THREE.Scene()

    this.scene.add(slices.object)
    // put a camera in the scene
    this.fov = 45
    let cameraPosition = this.calculateCameraPosition()
    this.camera = new THREE.PerspectiveCamera(this.fov, this.WIDTH / this.HEIGHT, 1, cameraPosition * 5)
    this.camera.position.z = cameraPosition

    // Controls
    this.controls = new TrackballControls(this.camera, this.renderer.domElement)
    this.controls.noRotate = true
    this.controls.staticMoving = true
    this.controls.addEventListener('change', this.render.bind(this))
    this.controls.addEventListener('change', this.slices.notify)
    this.controls.addEventListener('zoom', this.slices.notify)

    this.keyControls = new KeyControls()

    this.operationProxy = new OperationProxy(this)

    this.keyControls.addKeyListener('Ctrl+90', m => {
      m.event.preventDefault()
      this.operationProxy.undo()
    })

    this.keyControls.addKeyListener('Ctrl+89', m => {
      m.event.preventDefault()
      this.operationProxy.redo()
    })

    this.gui = new HatuGUI(slices.maxElevation, this)

    this.scene.add(this.swc)

    // Lights
    // doesn't actually work with any of the current shaders
    this.light = new THREE.DirectionalLight(0xffffff)
    this.light.position.set(0, 0, 1000)
    this.scene.add(this.light)

    let scope = this
    this.dragControls = new DragControls(this, this.renderer.domElement)
    this.dragControls.addEventListener('dragstart', event => {
      scope.controls.enabled = false
      scope.gui.nodeOperation.dragStart(event.object)
    })
    this.dragControls.addEventListener('drag', event => {
      scope.controls.enabled = true
      scope.gui.nodeOperation.drag(event.object, event.position)
    })
    this.dragControls.addEventListener('dragend', event => {
      scope.controls.enabled = true
      scope.gui.nodeOperation.dragEnd(event.object)
    })
    this.dragControls.addEventListener('hoveron', event => {
      scope.gui.nodeOperation.hoverOn(event.object)
    })
    this.dragControls.addEventListener('hoveroff', event => {
      scope.gui.nodeOperation.hoverOff(event.object)
    })
    this.dragControls.addEventListener('clicknothing', event => {
      scope.gui.nodeOperation.clickNothing(event.position)
    })

    this.gui.onElevationChange(elevation => {
      slices.setElevation(elevation)
      slices.notify()
      this.gui.visualMode = 'slices'
      this.gui.update()
      if (this.camera instanceof HatuOrthographicCamera) {
        this.camera.set(elevation)
      }
    })

    this.gui.onVisualModeChange(mode => {
      switch (mode) {
        case 'whole':
          slices.setElevation(0)
          slices.notify()
          this.camera.reset()
          break
        case 'slices':
          if (this.camera instanceof HatuOrthographicCamera) {
            this.camera.set(this.gui.elevation)
            slices.notify()
          }
          break
      }
    })

    this.gui.onNeuronModeChange(mode => {
      this.swc.edgeMode(mode)
    })
  }

  exportSwc () {

  }

  setPerspectiveCamera () {
    let cameraPosition = this.camera.position
    this.camera = new THREE.PerspectiveCamera(this.fov, this.WIDTH / this.HEIGHT, 1, this.calculateCameraPosition(this.fov) * 5)
    this.camera.position.copy(cameraPosition)

    this.controls.object = this.camera
  }

  setOrthographicCamera () {
    this.camera = new HatuOrthographicCamera(this.boundingBox, this.calculateCameraPosition() * 5, this.camera.position, this)
    this.controls.object = this.camera
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
