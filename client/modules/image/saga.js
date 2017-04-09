import * as actions from './action'
import ApiFetcher from '../ApiFetcher'
import _ from 'lodash'

import { put, call } from 'redux-saga/effects'
import { takeEvery } from 'redux-saga'

function * queryImageList () {
  const response = yield ApiFetcher.imageList()
  return yield response.text()
}

function * querySwcList (image) {
  const response = yield ApiFetcher.swcList(image)
  return yield response.text()
}

function * loadImageListSaga () {
  try {
    const queryRes = yield call(queryImageList)
    const imageList = JSON.parse(queryRes)
    for (let i = 0; i < imageList.length; i++){
      const swcList = yield call(querySwcList, imageList[i].image)
      imageList[i]['swc'] = JSON.parse(swcList)
    }
    yield put(actions.loadImageListSuccess({ imageList }))
  } catch (error) {
    yield put(actions.loadImageListFail(error))
  }
}

export function * watchImageListSaga () {
  yield * takeEvery(actions.LOAD_IMAGE_LIST, loadImageListSaga)
}