import * as Dat from 'dat.gui'
import {
  GUI_UPDATE_EVENT,
  CURSOR_POINTER_EVENT,
  CURSOR_AUTO_EVENT,
  CURSOR_MOVE_EVENT, TRACE_BOX_OPEN, TRACE_BOX_CLOSE
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
    this.operationProxy.addEventListener(TRACE_BOX_OPEN, event => this.startTrace(event.trace))
    this.operationProxy.addEventListener(TRACE_BOX_CLOSE, event => this.closeTrace(event.trace))
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

    this.gui.add(this, 'operation', ['AddNode', 'AddBranch', 'Delete', 'Edit', 'DeleteParent', 'ChangeParent', 'Trace'])
      .onChange(() => this.operationProxy.change(this.operation))

    this.traceFolder = this.gui.addFolder('Trace')

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

  /**
   *
   * @param {Number} maxElevation
   */
  setMaxElevation (maxElevation) {
    this.maxElevation = maxElevation
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

  /**
   *
   * @param {Trace} trace
   */
  startTrace (trace) {

    this.traceLeft = this.traceFolder.add(trace, 'left').min(0).step(0.0001)
    this.traceRight = this.traceFolder.add(trace, 'right').min(0).step(0.0001)
    this.traceTop = this.traceFolder.add(trace, 'top').min(0).step(0.0001)
    this.traceBottom = this.traceFolder.add(trace, 'bottom').min(0).step(0.0001)
    this.traceNear = this.traceFolder.add(trace, 'near').min(0).max(this.maxElevation).step(0.0001)
    this.traceFar = this.traceFolder.add(trace, 'far').min(0).max(this.maxElevation).step(0.0001)

    this.traceYes = this.traceFolder.add(trace, 'yes')
    this.traceNo = this.traceFolder.add(trace, 'no')
    this.traceFolder.open()
  }

  /**
   *
   * @param {Trace} trace
   */
  closeTrace (trace) {
    this.traceFolder.close()
    this.traceFolder.remove(this.traceLeft)
    this.traceFolder.remove(this.traceRight)
    this.traceFolder.remove(this.traceTop)
    this.traceFolder.remove(this.traceBottom)
    this.traceFolder.remove(this.traceNear)
    this.traceFolder.remove(this.traceFar)
    this.traceFolder.remove(this.traceYes)
    this.traceFolder.remove(this.traceNo)
  }
}
