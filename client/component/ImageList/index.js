import React from 'react'
import styles from './index.css'
import moment from 'moment'

import { Menu, Icon } from 'antd'
import { autobind, injectProps } from 'react-decoration'
import { connect } from 'react-redux'

import { loadImageList } from '../../modules/image/action'
import { loadSwc } from '../../modules/swc/action'

const { Item, SubMenu } = Menu

class ImageList extends React.Component {

  componentDidMount () {
    this.props.loadImageList()
  }

  @autobind
  @injectProps
  handleClick ({loadSwc}, e) {
    loadSwc({
      swcName: e.key,
      imageName: e.keyPath[1]
    })
  }

  @injectProps
  render ({ imageList }) {
    return (
      <div className={styles.imageList}>
        <Menu
          mode='inline'
          onClick={this.handleClick}
        >
          {
            imageList.map(imageInfo => (
              <SubMenu
                key={imageInfo.image }
                className={styles.imageItem}
                title={<span>{imageInfo.image}</span>}
              >
                {
                  imageInfo.swcHistory.map(swc => (
                    <Item
                      className={styles.swcItem}
                      key={swc.swc}
                    >
                      <div
                        className={styles.swcItem}
                      >{moment(swc.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
                      </div>
                    </Item>
                  ))
                }
              </SubMenu>
            ))
          }
        </Menu>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  imageList: state.image.imageList || []
})

const mapDispatchToProps = ({
  loadImageList,
  loadSwc
})

export default connect(mapStateToProps, mapDispatchToProps)(ImageList)
