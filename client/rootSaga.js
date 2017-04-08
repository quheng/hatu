import { fork } from 'redux-saga/effects'
import { watchImageListSaga } from './modules/image/saga'

export default function * rootSaga () {
  yield [
    fork(watchImageListSaga)
  ]
}
