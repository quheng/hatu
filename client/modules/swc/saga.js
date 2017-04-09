import * as actions from './action'
import ApiFetcher from '../ApiFetcher'

import { put, call } from 'redux-saga/effects'
import { takeEvery } from 'redux-saga'

function * querySwc () {
  const response = yield ApiFetcher.imageList()
  return yield response.text()
}

function * loadSwcListSaga () {
  try {

    yield put(actions.loadSwcSuccess({  }))
  } catch (error) {
    yield put(actions.loadSwcFail(error))
  }
}

export function * watchSwcListSaga () {
  yield * takeEvery(actions.LOAD_SWC, loadSwcListSaga)
}