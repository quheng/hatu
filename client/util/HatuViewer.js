'use strict'
const THREE = require('three')

import TrackballControls from './control/TrackballControls'
import Annotation from "./annotation/Annotation"
import {
  DRAG_NODE_MODE_EVENT, OperationProxy, DRAG_EDGE_MODE_EVENT, CHOOSE_BOX_OPEN, CHOOSE_BOX_UPDATE,
  CHOOSE_BOX_CLOSE
} from './operation/OperationProxy'
import KeyControls from './control/KeyControls'
import HatuOrthographicCamera from './control/HatuOrthographicCamera'
import HatuGUI from './control/HatuGUI'
import DragControls from './control/DragControls'

export default class HatuViewer {

  /**
   *
   * @param container
   */
  constructor (container) {
    this.container = container

    this.HEIGHT = container.offsetHeight
    this.WIDTH = container.offsetWidth
    this.LEFT = container.offsetLeft
    this.TOP = container.offsetTop

    this.boundingBox = this.defaultBoundingBox()
    this.center = this.defaultCenter()
    this.supervisor = null

    this.renderer = this.setUpRenderer()

    this.scene = new THREE.Scene()

    this.camera = new HatuOrthographicCamera(this)

    this.controls = this.setupControl()

    this.operationProxy = this.setupOperationProxy()

    this.setupKeyControl()

    this.gui = this.setupGUI()

    this.light = new THREE.DirectionalLight(0xffffff)
    this.scene.add(this.light)

    this.dragControls = this.setupDragControl()

    this.animate()
  }

  /**
   *
   * @param {Supervisor} supervisor
   */
  start (supervisor) {
    if (this.supervisor) {
      console.warn('Starting HatuViewer failed. Please finish at first.')
    } else {
      this.supervisor = supervisor
      this.scene.add(this.supervisor.getSlice().object)
      let slice = this.supervisor.getSlice()
      slice.viewer = this
      this.boundingBox = slice.boundingBox

      this.center = slice.center
      this.supervisor.getSwcs().forEach(swc => {
        this.scene.add(swc)
        swc.setPosition(-this.center[0], -this.center[1], -this.center[2])
      })

      this.supervisor.getAnnotation().position.set(-this.center[0], -this.center[1], -this.center[2])
      this.scene.add(this.supervisor.getAnnotation())
      this.camera.update()
      this.gui.setMaxElevation(slice.maxElevation)
      this.gui.setGuiMode(this.supervisor.getGuiMode())
      this.annotation = this.setupAnnotation()
      this.scene.add(this.annotation)
      this.supervisor.getOperationEvents().forEach((listener, event) => this.operationProxy.addEventListener(event, listener))
    }
  }

  finish () {
    if (this.supervisor) {
      this.supervisor.getSwcs().forEach(swc => {
        this.scene.remove(swc)
      })
      this.scene.remove(this.supervisor.getSlice().object)
      this.scene.remove(this.supervisor.getAnnotation())
      this.scene.remove(this.annotation)
      this.supervisor = null
      this.gui.reset()
      this.supervisor.getOperationEvents().forEach((listener, event) => this.operationProxy.removeEventListener(event, listener))
    } else {
      console.warn('Finishing HatuViewer failed. The HatuViewer has not been started.')
    }
  }

  exportSwc () {

  }

  /**
   *
   * @return {TrackballControls}
   */
  setupControl () {
    let controls = new TrackballControls(this, this.renderer.domElement)
    let self = this
    controls.noRotate = true
    controls.staticMoving = true
    controls.noRotate = true
    controls.staticMoving = true
    controls.addEventListener('change', this.render.bind(this))
    controls.addEventListener('change', () => {
      if (self.supervisor) {
        self.supervisor.getSlice().notify(self)
      }
    })
    controls.addEventListener('zoom', () => {
      if (self.supervisor) {
        self.supervisor.getSlice().notify(self)
      }
    })
    return controls
  }

  /**
   *
   * @return {KeyControls}
   */
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

  /**
   *
   * @return {DragControls}
   */
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
    dragControls.addEventListener('move', event => {
      scope.operationProxy.currentOperation.move(event.position)
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

  /**
   *
   * @return {HatuGUI}
   */
  setupGUI () {
    let self = this
    let gui = new HatuGUI(this)

    /**
     *
     * @param {Slices} slice
     * @param elevation
     */
    function onElevationChange (slice, elevation) {
      slice.setElevation(elevation)
      slice.notify(self)
      self.gui.visualMode = 'slices'
      self.gui.update()
      if (self.camera instanceof HatuOrthographicCamera) {
        self.camera.set(elevation)
      }
    }

    /**
     *
     * @param {Slices} slice
     * @param mode
     */
    function onVisualModeChange (slice, mode) {
      switch (mode) {
        case 'whole':
          slice.setElevation(0)
          slice.notify(self)
          self.camera.reset()
          break
        case 'slices':
          if (self.camera instanceof HatuOrthographicCamera) {
            self.camera.set(self.gui.elevation)
            slice.notify(self)
          }
          break
      }
    }

    /**
     *
     * @param {Swc[]} swcs
     * @param mode
     */
    function onNeuronModeChange (swcs, mode) {
      swcs.forEach(swc => swc.edgeMode(mode))
    }

    gui.onElevationChange(elevation => {
      if (this.supervisor) {
        onElevationChange(this.supervisor.getSlice(), elevation)
      }
    })

    gui.onVisualModeChange(mode => {
      if (this.supervisor) {
        onVisualModeChange(this.supervisor.getSlice(), mode)
      }
    })

    gui.onNeuronModeChange(mode => {
      onNeuronModeChange(this.supervisor.getSwcs(), mode)
    })

    return gui
  }

  /**
   *
   * @return {WebGLRenderer}
   */
  setUpRenderer () {
    let renderer = new THREE.WebGLRenderer({
      antialias: true
    })
    renderer.setClearColor(0xffffff, 1)
    renderer.setSize(this.WIDTH, this.HEIGHT)
    // noinspection JSUnresolvedVariable
    renderer.setPixelRatio(window.devicePixelRatio)
    this.container.appendChild(renderer.domElement)
    return renderer
  }

  /**
   *
   * @return {Annotation}
   */
  setupAnnotation () {
    let annotation = new Annotation()
    annotation.position.set(-this.center[0], -this.center[1], -this.center[2])
    this.operationProxy.addEventListener(CHOOSE_BOX_OPEN, event => annotation.openChooseBox())
    this.operationProxy.addEventListener(CHOOSE_BOX_UPDATE, event => annotation.updateChooseBox(event.position1, event.position2))
    this.operationProxy.addEventListener(CHOOSE_BOX_CLOSE, event => annotation.closeChooseBox())
    return annotation
  }

  render () {
    this.renderer.render(this.scene, this.camera)
  }

  animate () {
    // loop on request animation loop
    window.requestAnimationFrame(this.animate.bind(this))
    this.controls.update()
    let p = this.camera.position
    this.light.position.set(p.x, p.y, p.z)
    this.render()
  }

  /**
   *
   * @return {{left: *, right: *, top: *, bottom: *}}
   */
  getWindow () {
    let camera = this.camera
    return {
      left: camera.position.x + camera.left + this.center[0],
      right: camera.position.x + camera.right + this.center[0],
      top: camera.position.y + camera.top + this.center[1],
      bottom: camera.position.y + camera.bottom + this.center[1]
    }
  }

  defaultBoundingBox () {
    return {
      'xmin': 0,
      'xmax': this.WIDTH,
      'ymin': 0,
      'ymax': this.HEIGHT,
      'zmin': 0,
      'zmax': 100
    }
  }

  defaultCenter () {
    return [this.WIDTH / 2, this.HEIGHT / 2, 50]
  }

}
