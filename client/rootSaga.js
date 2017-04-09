import { fork } from 'redux-saga/effects'
import { watchImageListSaga } from './modules/image/saga'
import { watchSwcSaga } from './modules/swc/saga'

export default function * rootSaga () {
  yield [
    fork(watchImageListSaga),
    fork(watchSwcSaga)
  ]
}
