import * as actions from './action'
import ApiFetcher from '../ApiFetcher'

import { put, call } from 'redux-saga/effects'
import { takeEvery } from 'redux-saga'

function * queryImageList () {
  const response = yield ApiFetcher.imageList()
  return yield response.text()
}

function * loadImageListSaga () {
  try {
    const queryRes = yield call(queryImageList)
    yield put(actions.loadImageListSuccess({ imageList: JSON.parse(queryRes) }))
  } catch (error) {
    yield put(actions.loadImageListFail(error))
  }
}

export function * watchImageListSaga () {
  yield * takeEvery(actions.LOAD_IMAGE_LIST, loadImageListSaga)
}