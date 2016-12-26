import React from 'react'
import styles from './index.css'

import { loadSwcFile } from '../../modules/swc/action'
import { Menu } from 'antd'
import { autobind, injectProps } from 'react-decoration'
import { connect } from 'react-redux'

const { Item } = Menu

class SwcList extends React.Component {

  @autobind
  @injectProps
  handleClick ({loadSwcFile}, e) {
    loadSwcFile({key: e.key})
  }

  @injectProps
  render ({ swcList }) {
    return (
      <div className={styles.swcList}>
        {
          swcList && (
            <Menu onClick={this.handleClick}>
              {
                swcList.map((swc) => (
                  <Item key={swc} className={styles.swcItem}>
                    <span>{swc}</span>
                  </Item>
                ))
              }
            </Menu>
          )
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  swcList: state.swc.swcList
})

const mapDispatchToProps = ({
  loadSwcFile
})

export default connect(mapStateToProps, mapDispatchToProps)(SwcList)
