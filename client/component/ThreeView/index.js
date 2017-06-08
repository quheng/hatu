import React from 'react'
import _ from 'lodash'
import styles from './index.css'
import HatuViewer from '../../util/HatuViewer'
import Slices from '../../util/slice/Slices'
import Editor from '../../util/Editor'

import { connect } from 'react-redux'

class ThreeView extends React.Component {
  render () {
    return (<div className={styles.threeView} ref='container' />)
  }

  componentWillReceiveProps ({ swcInfo }) {
    try {
      const slices = new Slices(1024, 1024, 97, swcInfo.imageName)
      const hatuViewer = new HatuViewer(this.refs.container)

      // /////////////////////////////////////////////////////////////////////
      // This two lines are the actual interface to start a resolver

      // let resolver = new Resolver(samples.ops1, samples.ops2, slices, samples.source)
      // resolver.onCommit((ancestor, result) => {
      //   console.log(ancestor)
      //   console.log(result)
      // })
      // hatuViewer.start(resolver)
      let editor = new Editor(swcInfo.swcContent, '', slices)
      editor.onCommit((ancestor, result) => {
        console.log(ancestor)
        console.log(result)
      })
      hatuViewer.start(editor)
      // /////////////////////////////////////////////////////////////////////
    } catch (err) {
      console.log(err)
    }
  }
}

const mapStateToProps = (state) => ({
  swcInfo: _.get(state, 'swc.swcInfo', {})
})

export default connect(mapStateToProps, null)(ThreeView)
