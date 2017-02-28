'use strict'
const THREE = require('three')

import TrackballControls from './control/TrackballControls'
import OperationProxy from './control/OperationProxy'
import KeyControls from './control/KeyControls'
import RendererFactory from './renderer/RendererFactory'
import HatuOrthographicCamera from './control/HatuOrthographicCamera'
import HatuGUI from './control/HatuGUI'
import DragControls from './control/DragControls'

export default class HatuViewer {

  constructor (container, swc, slices, showCones) {
    this.container = container
    this.swc = swc

    // html element that will recieve webgl canvas
    this.HEIGHT = container.offsetHeight
    // width of canvas
    this.WIDTH = container.offsetWidth
    this.LEFT = container.offsetLeft
    this.TOP = container.offsetTop
    // which node to center neuron on (starts at 1), -1 to center at center of bounding box
    this.centerNode = swc.centerNode

    // show cones between cylindars for particle and sphere mode
    this.showCones = showCones

    // initialize bounding box
    this.boundingBox = this.swc.calculateBoundingBox()
    this.center = this.calculateCenterNode()
    this.slices = slices
    this.slices.viewer = this

    // setup render
    this.renderer = this.setUpRenderer()
    let gl = this.renderer.context
    // Activate depth extension, if available
    gl.getExtension('EXT_frag_depth')

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

    this.rendererFactory = new RendererFactory(this)
    this.neuronRenderer = this.rendererFactory.create(this.gui.neuronMode)

    this.scene.add(this.neuronRenderer)

    // Lights
    // doesn't actually work with any of the current shaders
    this.light = new THREE.DirectionalLight(0xffffff)
    this.light.position.set(0, 0, 1000)
    this.scene.add(this.light)

    let scope = this
    this.dragControls = new DragControls(this, this.renderer.domElement)
    this.dragControls.addEventListener('dragstart', function (event) {
      scope.controls.enabled = false
      scope.gui.nodeOperation.dragStart(event.object)
    })
    this.dragControls.addEventListener('drag', function (event) {
      scope.controls.enabled = true
      scope.gui.nodeOperation.drag(event.object, event.position)
    })
    this.dragControls.addEventListener('dragend', function (event) {
      scope.controls.enabled = true
      scope.gui.nodeOperation.dragEnd(event.object)
    })
    this.dragControls.addEventListener('hoveron', function (event) {
      scope.gui.nodeOperation.hoverOn(event.object)
    })
    this.dragControls.addEventListener('hoveroff', function (event) {
      scope.gui.nodeOperation.hoverOff(event.object)
    })
    this.dragControls.addEventListener('clicknothing', function (event) {
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
      this.swc = this.exportSwc()
      this.scene.remove(this.neuronRenderer)
      this.neuronRenderer = this.rendererFactory.create(mode)
      this.dragControls.objects = this.neuronRenderer.children
      this.scene.add(this.neuronRenderer)
    })
  }

  exportSwc () {
    return this.neuronRenderer.exportAsSwc()
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

  calculateCenterNode () {
    // neuron centers around 1st node by default
    let center
    center = [(this.boundingBox.xmax + this.boundingBox.xmin) / 2, (this.boundingBox.ymax + this.boundingBox.ymin) / 2, (this.boundingBox.zmax + this.boundingBox.zmin) / 2]
    return center
  }

  // calculates camera position based on boudning box
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
    // do the render
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
