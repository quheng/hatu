import React from "react"
import styles from "./index.css"
import HatuViewer from "../../util/HatuViewer"
import Slices from "../../util/slice/Slices"
import { connect } from "react-redux"
import Swc from "../../util/swc/Swc"
import { modify } from "../../../test/client/sample/SwcSamples"
import Resolver from "../../util/resolver/Resolver"
import { samples } from "../../../test/client/sample/SwcSamples"
import Editor from "../../util/Editor"

class ThreeView extends React.Component {
  render () {
    return (<div className={styles.threeView} ref='container' />)
  }

  componentWillReceiveProps ({ swcInfo }) {
    try {
      const swc = new Swc(swcInfo.swcContent, 0x0)
      const slices = new Slices(1024, 1024, 97, swcInfo.imageName)
      const hatuViewer = new HatuViewer(this.refs.container)

      let adjusted = modify(swc)

      // /////////////////////////////////////////////////////////////////////
      // This two lines are the actual interface to start a resolver

      let resolver = new Resolver(samples.ops1, samples.ops2, slices, samples.source)
      resolver.onCommit((ancestor, result) => {
        console.log(ancestor)
        console.log(result)
      })
      hatuViewer.start(resolver)
      // let editor = new Editor(samples.source, samples.ops1, slices)
      // editor.onCommit((ancestor, result) => {
      //   console.log(ancestor)
      //   console.log(result)
      // })
      // hatuViewer.start(editor)
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
