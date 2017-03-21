import React from 'react'
import styles from './index.css'
import HatuViewer from '../../util/HatuViewer'
import Slices from '../../util/slice/Slices'
import { connect } from 'react-redux'
import Swc from '../../util/swc/Swc'
import { OperationProxy } from '../../util/operation/OperationProxy'
import Resolver from '../../util/resolver/Resolver'

class ThreeView extends React.Component {

  render () {
    return (<div className={styles.threeView} ref='container' />)
  }

  componentWillReceiveProps ({ swcFile }) {
    try {
      let swc = new Swc(swcFile, 0x0)
      let slices = new Slices(1024, 1024, 97)
      let hatuViewer = new HatuViewer(this.refs.container)

      let proxy = new OperationProxy()
      proxy.setupOperation()
      swc.nodes.slice(2, 6).forEach(node => {
        proxy.currentOperation.dragStart(node)
        proxy.currentOperation.drag(node, node.position.clone().setX(node.position.x + 40))
        proxy.currentOperation.dragEnd(node)
      })
      for (let i = 0; i < 2; i++) {
        let node = swc.nodes[swc.nodes.length - 1]
        let position = node.position.clone()
        position.setX(position.x + 10)
        position.setY(position.y - 40)
        swc.addBranch(node, position)
      }

      let adjusted = swc.serialize()
      console.log(adjusted)

      // /////////////////////////////////////////////////////////////////////
      // This two lines are the actual interface to start a resolver
      let resolver = new Resolver(swcFile, adjusted, slices)
      hatuViewer.start(resolver)
      // /////////////////////////////////////////////////////////////////////
    } catch (err) {
      console.log(err)
    }
  }
}

const mapStateToProps = (state) => ({
  swcFile: state.swc.swcFile
})

export default connect(mapStateToProps, null)(ThreeView)
