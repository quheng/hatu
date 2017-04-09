import React from 'react'
import styles from './index.css'
import moment from 'moment'

import { loadImageList } from '../../modules/image/action'
import { Menu } from 'antd'
import { autobind, injectProps } from 'react-decoration'
import { connect } from 'react-redux'

const { Item, SubMenu } = Menu

class ImageList extends React.Component {

  componentDidMount () {
    this.props.loadImageList()
  }

  @autobind
  @injectProps
  handleClick ({loadSwcFile}, e) {
    // loadSwcFile({key: e.key})
  }

  @injectProps
  render ({ imageList }) {
    return (
      <div className={styles.imageList}>
        <Menu onClick={this.handleClick}>
          {
            imageList.map(imageInfo => (
              <SubMenu key={imageInfo}
                    className={styles.imageItem}
                    title={<span>{imageInfo.image}</span>}
              >
                {
                  imageInfo.swcHistory.map(swc => (
                    <Item key="sub3"> {moment(swc.createdAt).format('MMMM Do YYYY, h:mm:ss a')} </Item>
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
  loadImageList
})

export default connect(mapStateToProps, mapDispatchToProps)(ImageList)
