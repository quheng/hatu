import { fork } from 'redux-saga/effects'
import { watchSwcListSaga, watchSwcFileSaga, watchWriteSwcFileSaga } from './modules/swc/saga'

export default function * rootSaga () {
  yield [
    fork(watchSwcListSaga),
    fork(watchSwcFileSaga),
    fork(watchWriteSwcFileSaga)
  ]
}
