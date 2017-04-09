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
    const swc = yield call(querySwc, action.payload)
    yield put(actions.loadSwcSuccess({ swc }))
  } catch (error) {
    yield put(actions.loadSwcFail(error))
  }
}

export function * watchSwcSaga () {
  yield * takeEvery(actions.LOAD_SWC, loadSwcSaga)
}