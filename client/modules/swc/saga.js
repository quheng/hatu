import fetch from 'isomorphic-fetch'
import * as actions from './action'

import { apiAddress } from '../../util/constants'
import { put, call } from 'redux-saga/effects'
import { takeEvery } from 'redux-saga'

function * querySwcList () {
  const response = yield fetch(apiAddress + '/swc/keys', {
    method: 'GET'
  })
  return yield response.text()
}

function * loadSwcListSaga (action) {
  try {
    const queryRes = yield call(querySwcList)
    yield put(actions.loadSwcListSuccess({ swcList: JSON.parse(queryRes) }))
  } catch (error) {
    yield put(actions.loadSwcListFail(error))
  }
}

function * querySwcFile (key) {
  const response = yield fetch(apiAddress + '/swc/key/' + key, {
    method: 'GET'
  })
  return yield response.text()
}

function * loadSwcFileSaga (action) {
  const { key } = action.payload
  try {
    const queryRes = yield call(querySwcFile, key)
    yield put(actions.loadSwcFileSuccess({ swcFile: queryRes }))
  } catch (error) {
    yield put(actions.loadSwcFileFail(error))
  }
}

function * writeSwcFile (key, content) {
  const response = yield fetch(apiAddress + '/swc/key/' + key, {
    method: 'POST',
    body: content
  })
  return response.status
}

function * writeSwcFileSaga (action) {
  const { key, content } = action.payload
  try {
    const writeRes = yield call(writeSwcFile, key, content)
    if (writeRes === 200) {
      yield put(actions.writeSwcFileSuccess({ swcFile: content }))
      yield put(actions.loadSwcList())
    } else {
      yield put(actions.writeSwcFileSwcFileFail(writeRes))
    }
  } catch (error) {
    yield put(actions.writeSwcFileSwcFileFail(error))
  }
}

export function * watchSwcListSaga () {
  yield * takeEvery(actions.LOAD_SWC_LIST, loadSwcListSaga)
}

export function * watchSwcFileSaga () {
  yield * takeEvery(actions.LOAD_SWC_FILE, loadSwcFileSaga)
}

export function * watchWriteSwcFileSaga () {
  yield * takeEvery(actions.WRITE_SWC_FILE, writeSwcFileSaga)
}
