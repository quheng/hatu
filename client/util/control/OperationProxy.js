export default class OperationProxy {

  /**
   *
   * @param {HatuViewer} viewer
   */
  constructor (viewer) {
    this.viewer = viewer
    this.operations = []
    this.rear = 0
  }

  undo () {
    if (this.rear > 0) {
      this.rear--
      this.operations[this.rear].cancel()
    }
    console.log(this.operations)
  }

  redo () {
    if (this.rear < this.operations.length) {
      this.operations[this.rear].conduct()
      this.rear++
    }
    console.log(this.operations)
  }

  /**
   *
   * @param {NodeOperation} operation
   */
  conduct (operation) {
    operation.conduct()
    this.operations[this.rear] = operation
    this.rear++
    this.operations = this.operations.slice(0, this.rear)
  }
}
