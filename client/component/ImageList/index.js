import React from 'react'
import styles from './index.css'
import moment from 'moment'

import { Menu, Popover } from 'antd'
import { autobind, injectProps } from 'react-decoration'
import { connect } from 'react-redux'

import { loadImageList } from '../../modules/image/action'
import { loadSwc } from '../../modules/swc/action'

const { Item, SubMenu } = Menu

const getSwcInfoPopover = (swc) => (
  <div>
    <p>creator: {swc.username}</p>
    <p>comments: {swc.comments}</p>
    <p>created time: {moment(swc.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</p>
  </div>
)

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
          style={{ height: '100%' }}
          mode='inline'
          onClick={this.handleClick}
        >
          {
            imageList.map(imageInfo => (
              <SubMenu
                key={imageInfo.image}
                className={styles.imageItem}
                title={<span>{imageInfo.image}</span>}
              >
                {
                  imageInfo.swcHistory.map(swc => (
                    <Item
                      style={{marginLeft: '-20px'}}
                      key={swc.swc}
                    >
                      <Popover content={getSwcInfoPopover(swc)} title='swc info'>
                        {
                          moment(swc.createdAt).format('MMMM Do YYYY, h:mm:ss a')
                        }
                      </Popover>
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
