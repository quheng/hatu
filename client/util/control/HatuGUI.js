import * as Dat from 'dat.gui'
import OperationFactory from './operation/OperationFactory'

function near (a, b) {
  return Math.abs(a - b) < 0.00001
}

export default class HatuGUI {

  constructor (maxElevation, viewer) {
    this.gui = new Dat.GUI()
    this.viewer = viewer
    this.dom = viewer.renderer.domElement
    this.elevation = 0
    this.visualMode = 'whole'
    this.neuronMode = 'skeleton'

    this.selectedNode = null
    this.radius = 0
    this.x = 0
    this.y = 0
    this.z = 0

    this.operation = 'Arrow'
    this.operationFactory = new OperationFactory(this)
    this.setupOperation()

    let overviewFolder = this.gui.addFolder('Overview')

    this.elevationController = overviewFolder.add(this, 'elevation', 0, maxElevation).step(1)
    this.visualModeController = overviewFolder.add(this, 'visualMode', ['slices', 'whole'])
    this.neuronModeController = overviewFolder.add(this, 'neuronMode', ['skeleton', 'sphere'])
    overviewFolder.open()

    let nodeFolder = this.gui.addFolder('Node')
    nodeFolder.add(this, 'radius').min(0).step(0.0001).onChange(radius => {
      if (this.selectedNode && !near(this.selectedNode.radius, radius)) {
        this.nodeOperation.mode = 'radius'
        this.nodeOperation.radius = radius
        this.viewer.operationProxy.conduct(this.nodeOperation)
      }
    })

    nodeFolder.add(this, 'x').min(0).step(0.0001).onChange(x => {
      if (this.selectedNode && !near(this.selectedNode.x, x)) {
        this.nodeOperation.mode = 'x'
        this.nodeOperation.x = x
        this.viewer.operationProxy.conduct(this.nodeOperation)
      }
    })

    nodeFolder.add(this, 'y').min(0).step(0.0001).onChange(y => {
      if (this.selectedNode && !near(this.selectedNode.y, y)) {
        this.nodeOperation.mode = 'y'
        this.nodeOperation.y = y
        this.viewer.operationProxy.conduct(this.nodeOperation)
      }
    })

    nodeFolder.add(this, 'z').min(0).step(0.0001).onChange(z => {
      if (this.selectedNode && !near(this.selectedNode.z, z)) {
        this.nodeOperation.mode = 'z'
        this.nodeOperation.z = z
        this.viewer.operationProxy.conduct(this.nodeOperation)
      }
    })
    nodeFolder.open()

    this.gui.add(this, 'operation', ['AddNode', 'AddBranch', 'DeleteNode', 'Arrow'])
      .onChange(() => {
        if (this.nodeOperation) {
          this.nodeOperation.uninstall()
        }
        this.setupOperation()
        this.nodeOperation.activate()
        this.resetNode()
      })

    this.folders = [overviewFolder, nodeFolder]
  }

  onElevationChange (f) {
    this.elevationController.onChange(f)
  }

  onVisualModeChange (f) {
    this.visualModeController.onChange(f)
  }

  onNeuronModeChange (f) {
    this.neuronModeController.onChange(f)
  }

  update () {
    this.radius = this.selectedNode.radius
    this.x = this.selectedNode.position.x
    this.y = this.selectedNode.position.y
    this.z = this.selectedNode.position.z

    this.folders.forEach(folder => {
      folder.__controllers.forEach(e => e.updateDisplay())
    })
    this.gui.__controllers.forEach(e => e.updateDisplay())
  }

  set node (value) {
    if (this.selectedNode) {
      this.selectedNode.material.emissive.setHex(this.selectedNode.currentHex)
    }
    this.selectedNode = value
    this.selectedNode.currentHex = value.material.emissive.getHex()
    this.selectedNode.material.emissive.setHex(0xff0000)

    this.update()
  }

  resetNode () {
    if (this.selectedNode) {
      this.selectedNode.material.emissive.setHex(this.selectedNode.currentHex)
    }

    this.selectedNode = null
    this.radius = 0
    this.x = 0
    this.y = 0
    this.z = 0
    this.update()
  }

  setupOperation () {
    if (this.nodeOperation) {
      this.nodeOperation.deactivate()
    }
    this.nodeOperation = this.operationFactory.create(this.operation)
  }
}
