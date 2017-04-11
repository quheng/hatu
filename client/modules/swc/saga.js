import * as actions from './action'
import ApiFetcher from '../ApiFetcher'

import { put, call } from 'redux-saga/effects'
import { takeEvery } from 'redux-saga'

function * querySwc (swc) {
  const response = yield ApiFetcher.swc(swc)
  return yield response.text()
}

function * loadSwcSaga (action) {
  try {
    const { swcName, imageName } = action.payload
    const swcContent = yield call(querySwc, swcName)
    yield put(actions.loadSwcSuccess({
      swcName,
      imageName,
      swcContent
    }))
  } catch (error) {
    yield put(actions.loadSwcFail(error))
  }
}

export function * watchSwcSaga () {
  yield * takeEvery(actions.LOAD_SWC, loadSwcSaga)
}
