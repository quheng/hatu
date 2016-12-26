import Arrow from './Arrow'
import AddBranch from './AddBranch'
import DeleteNode from './DeleteNode'
import AddNode from './AddNode'

export default class OperationFactory {
  /**
   *
   * @param {HatuGUI} gui
   */
  constructor (gui) {
    this.gui = gui
  }

  /**
   * create operation instance according to name
   * @param {String} name
   * @return {NodeOperation}
   */
  create (name) {
    switch (name) {
      case 'Arrow':
        return new Arrow(this.gui)
      case 'AddBranch':
        return new AddBranch(this.gui)
      case 'AddNode':
        return new AddNode(this.gui)
      case 'DeleteNode':
        return new DeleteNode(this.gui)
    }
  }
}
