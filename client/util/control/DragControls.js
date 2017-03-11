'use strict'

import HatuNode from '../swc/HatuNode'
import * as THREE from 'three'

export default class DragControls extends THREE.EventDispatcher {
  /**
   *
   * @param {HatuViewer} _viewer
   * @param _domElement
   */
  constructor (_viewer, _domElement) {
    super()
    let scope = this
    this.mode = 'node'
    let _plane = new THREE.Plane()
    // TODO: We need a sample node to initiate viewport plane and the center node 1 is chosen. However, the No.1 node might not exist. Be careful.
    _plane.setFromNormalAndCoplanarPoint(_viewer.camera.getWorldDirection(_plane.normal), _viewer.centerNode.position)

    let _raycaster = new THREE.Raycaster()

    let _mouse = new THREE.Vector2()
    let _offset = new THREE.Vector3()
    let _intersection = new THREE.Vector3()

    let _selected, _hovered
    _selected = null
    _hovered = null

    function activate () {
      _domElement.addEventListener('mousemove', onDocumentMouseMove, false)
      _domElement.addEventListener('mousedown', onDocumentMouseDown, false)
      _domElement.addEventListener('mouseup', onDocumentMouseUp, false)
    }

    function deactivate () {
      _domElement.removeEventListener('mousemove', onDocumentMouseMove, false)
      _domElement.removeEventListener('mousedown', onDocumentMouseDown, false)
      _domElement.removeEventListener('mouseup', onDocumentMouseUp, false)
    }

    function dispose () {
      deactivate()
    }

    function onDocumentMouseMove (event) {
      event.preventDefault()
      _mouse.x = ((event.clientX - _viewer.LEFT) / _domElement.width) * 2 - 1
      _mouse.y = -((event.clientY - _viewer.TOP) / _domElement.height) * 2 + 1

      _raycaster.setFromCamera(_mouse, _viewer.camera)

      if (_selected && scope.enabled) {
        if (_raycaster.ray.intersectPlane(_plane, _intersection)) {
          scope.dispatchEvent({ type: 'drag', object: _selected, position: _intersection.sub(_offset) })
        }

        return
      }

      _raycaster.setFromCamera(_mouse, _viewer.camera)

      let intersects = intersectObjects()

      if (intersects.length > 0) {
        let object = intersects[0].object

        _plane.setFromNormalAndCoplanarPoint(_viewer.camera.getWorldDirection(_plane.normal), object.position)

        if (_hovered !== object) {
          scope.dispatchEvent({ type: 'hoveron', object: object })
          _hovered = object
        }
      } else {
        if (_hovered !== null) {
          scope.dispatchEvent({ type: 'hoveroff', object: _hovered })
          _hovered = null
        }
      }
    }

    function onDocumentMouseDown (event) {
      event.preventDefault()

      _raycaster.setFromCamera(_mouse, _viewer.camera)

      let intersects = intersectObjects()

      if (intersects.length > 0) {
        _selected = intersects[0].object

        if (_raycaster.ray.intersectPlane(_plane, _intersection)) {
          _offset.copy(_intersection).sub(_selected.position)
        }

        scope.dispatchEvent({ type: 'dragstart', object: _selected })
      } else {
        let emptyPosition = _raycaster.ray.intersectPlane(_plane)
        emptyPosition.setX(emptyPosition.x + _viewer.center[0])
        emptyPosition.setY(emptyPosition.y + _viewer.center[1])
        scope.dispatchEvent({ type: 'clicknothing', position: emptyPosition })
      }
    }

    function onDocumentMouseUp (event) {
      event.preventDefault()

      if (_selected) {
        scope.dispatchEvent({ type: 'dragend', object: _selected })

        _selected = null
      }
    }

    function intersectObjects () {
      switch (scope.mode) {
        case 'node' :
          return _raycaster.intersectObjects(_viewer.swc.getNodes())
        case 'edge':
          return _raycaster.intersectObjects(_viewer.swc.getEdges())
      }
    }

    activate()

    // API

    this.enabled = true

    this.activate = activate
    this.deactivate = deactivate
    this.dispose = dispose

    // Backward compatibility

    this.setObjects = function () {
      console.error('THREE.DragControls: setObjects() has been removed.')
    }

    this.on = function (type, listener) {
      console.warn('THREE.DragControls: on() has been deprecated. Use addEventListener() instead.')
      scope.addEventListener(type, listener)
    }

    this.off = function (type, listener) {
      console.warn('THREE.DragControls: off() has been deprecated. Use removeEventListener() instead.')
      scope.removeEventListener(type, listener)
    }

    this.notify = function (type) {
      console.error('THREE.DragControls: notify() has been deprecated. Use dispatchEvent() instead.')
      scope.dispatchEvent({ type: type })
    }
  }

  set objects (objects) {
    this._objects = objects.filter(e => e instanceof HatuNode)
  }
}
