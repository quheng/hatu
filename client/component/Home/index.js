import React from 'react'
import styles from './index.css'
import ThreeView from '../ThreeView'
import ImageList from '../ImageList'

export default class Home extends React.Component {
  render () {
    return (
      <div className={styles.home}>
        <div>
          <ImageList className={styles.imageList} />
        </div>
        {/*<ThreeView className={styles.threeView} />*/}
      </div>
    )
  }
}
