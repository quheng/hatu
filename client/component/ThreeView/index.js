import React from "react"
import styles from "./index.css"
import HatuViewer from "../../util/HatuViewer"
import Slices from "../../util/slice/Slices"
import { connect } from "react-redux"
import Swc from "../../util/swc/Swc"
import Resolver from "../../util/resolver/Resolver"
import { modify, samples } from "../../../test/client/sample/SwcSamples"

class ThreeView extends React.Component {

  render () {
    return (<div className={styles.threeView} ref='container' />)
  }

  componentWillReceiveProps ({ swcFile }) {
    try {
      let swc = new Swc(swcFile, 0x0)
      let slices = new Slices(1024, 1024, 97)
      let hatuViewer = new HatuViewer(this.refs.container)

      let adjusted = modify(swc)

      // /////////////////////////////////////////////////////////////////////
      // This two lines are the actual interface to start a resolver
      // let resolver = new Resolver(swcFile, adjusted, slices, swcFile)
      console.log(samples.master)
      console.log(samples.normalUser)
      let resolver = new Resolver(samples.master, samples.normalUser, slices, samples.master)
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
