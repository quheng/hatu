import * as Dat from 'dat.gui'
import {
  GUI_UPDATE_EVENT,
  CURSOR_POINTER_EVENT,
  CURSOR_AUTO_EVENT,
  CURSOR_MOVE_EVENT
} from '../operation/OperationProxy'

export default class HatuGUI {

  /**
   *
   * @param {HatuViewer} viewer
   */
  constructor (viewer) {
    this.gui = new Dat.GUI()
    this.dom = viewer.renderer.domElement
    this.elevation = 0
    this.visualMode = 'whole'
    this.neuronMode = 'skeleton'

    this.radius = 0
    this.x = 0
    this.y = 0
    this.z = 0
    this.customedOperations = []
    let self = this
    this.operationProxy = viewer.operationProxy
    this.operation = this.operationProxy.operationName
    this.operationProxy.addEventListener(GUI_UPDATE_EVENT, () => {
      self.update()
    })
    this.operationProxy.addEventListener(CURSOR_POINTER_EVENT, () => {
      self.dom.style.cursor = 'pointer'
    })
    this.operationProxy.addEventListener(CURSOR_AUTO_EVENT, () => {
      self.dom.style.cursor = 'auto'
    })
    this.operationProxy.addEventListener(CURSOR_MOVE_EVENT, () => {
      self.dom.style.cursor = 'move'
    })
    this.operationProxy.setupOperation()

    let overviewFolder = this.gui.addFolder('Overview')

    this.elevationController = overviewFolder.add(this, 'elevation', 0, 0).step(1)
    this.visualModeController = overviewFolder.add(this, 'visualMode', ['slices', 'whole'])
    this.neuronModeController = overviewFolder.add(this, 'neuronMode', ['skeleton', 'cylinder'])
    overviewFolder.open()

    let nodeFolder = this.gui.addFolder('Node')

    function near (a, b) {
      return Math.abs(a - b) < 0.00001
    }

    function edit (name) {
      nodeFolder.add(self, name).min(0).step(0.0001).onChange(target => {
        if (self.operationProxy.getNode() && !near(self.operationProxy.getNode()[name], target)) {
          self.operationProxy.currentOperation.mode = name
          self.operationProxy.currentOperation[name] = target
          self.operationProxy.currentOperation.edit()
        }
      })
    }

    edit('radius')
    edit('x')
    edit('y')
    edit('z')

    nodeFolder.open()

    this.gui.add(this, 'operation', ['AddNode', 'AddBranch', 'DeleteNode', 'Arrow'])
      .onChange(() => this.operationProxy.change(this.operation))

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

  setMaxElevation (maxElevation) {
    this.elevationController.max(maxElevation)
  }

  /**
   *
   * @param {Map.<string, function()>} mode
   */
  setGuiMode (mode) {
    mode.forEach((op, key) => {
      this[key] = op
      this.customedOperations.push(this.gui.add(this, key))
    })
  }

  reset () {
    this.customedOperations.forEach(controller => this.gui.remove(controller))
  }

  update () {
    let selectedNode = this.operationProxy.getNode()
    if (selectedNode) {
      this.radius = selectedNode.radius
      this.x = selectedNode.position.x
      this.y = selectedNode.position.y
      this.z = selectedNode.position.z
    } else {
      this.radius = 0
      this.x = 0
      this.y = 0
      this.z = 0
    }

    this.folders.forEach(folder => {
      folder.__controllers.forEach(e => e.updateDisplay())
    })
    this.gui.__controllers.forEach(e => e.updateDisplay())
  }

}
