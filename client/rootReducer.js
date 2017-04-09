import image from './modules/image/reducer'
import swc from './modules/swc/reducer'

import { combineReducers } from 'redux'

export default combineReducers({
  image,
  swc
})
