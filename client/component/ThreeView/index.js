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
      let swc = new Swc(swcFile,0x0)
      let slices = new Slices(1024, 1024, 97)
      let hatuViewer = new HatuViewer(this.refs.container)

      let proxy = new OperationProxy()
      proxy.setupOperation()
      swc.nodes.slice(2, 6).forEach(node => {
        proxy.currentOperation.dragStart(node)
        proxy.currentOperation.drag(node, node.position.clone().setX(node.position.x + 40))
        proxy.currentOperation.dragEnd(node)
      })
      let adjusted = swc.serialize()
      let resolver = new Resolver(new Swc(swcFile,0x444400), new Swc(adjusted,0x000022), slices)
      hatuViewer.start(resolver)
    } catch (err) {
      console.log(err)
    }
  }
}

const mapStateToProps = (state) => ({
  swcFile: state.swc.swcFile
})

export default connect(mapStateToProps, null)(ThreeView)
