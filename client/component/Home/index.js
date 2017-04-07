import React from 'react'
import styles from './index.css'
import ThreeView from '../ThreeView'
import SwcList from '../ImageList'

import { connect } from 'react-redux'
import { injectProps, autobind } from 'react-decoration'
import { loadSwcList, writeSwcFile } from '../../modules/swc/action'

class Home extends React.Component {

  @autobind
  loaded (evt) {
    const fileName = this.state.fileName
    const fileString = evt.target.result
    this.props.writeSwcFile({
      key: fileName,
      content: fileString
    })
  }

  @autobind
  getFile (event) {
    const file = document.getElementById('swc').files[0]
    this.state = {fileName: file.name}
    const reader = new window.FileReader()
    reader.readAsText(file, 'UTF-8')
    reader.onload = this.loaded
  }

  @injectProps
  componentDidMount ({ loadSwcList }) {
    loadSwcList()
  }

  render () {
    return (
      <div className={styles.home}>
        <div>
          <input id='swc' name='上传 swc 文件' type='file' onChange={this.getFile} />
          <SwcList className={styles.swcList} />
        </div>
        <ThreeView className={styles.threeView} />
      </div>
    )
  }
}

const mapDispatchToProps = ({
  loadSwcList,
  writeSwcFile
})

export default connect(null, mapDispatchToProps)(Home)
