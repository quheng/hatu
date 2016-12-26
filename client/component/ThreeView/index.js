import React from 'react'
import styles from './index.css'
import HatuViewer from '../../util/HatuViewer'
import Swc from '../../util/Swc'
import Slices from '../../util/Slices'

import { connect } from 'react-redux'

class ThreeView extends React.Component {

  render () {
    return (<div className={styles.threeView} ref='container' />)
  }

  componentWillReceiveProps ({ swcFile }) {
    try {
      let swc = new Swc(swcFile)
      let boundingBox = swc.calculateBoundingBox()
      let slices = new Slices(Math.ceil(boundingBox.xmax), Math.ceil(boundingBox.ymax), Math.ceil(boundingBox.zmax))
      let hatuViewer = new HatuViewer(this.refs.container, swc, slices, true)
      hatuViewer.setOrthographicCamera()
      hatuViewer.animate()
    } catch (err) {
      // alert("渲染失败")
    }
  }
}

const mapStateToProps = (state) => ({
  swcFile: state.swc.swcFile
})

export default connect(mapStateToProps, null)(ThreeView)
