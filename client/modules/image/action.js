import { getActionNameGen, FSActionCreatorGen } from '../FsActionCreatorGen'

const getActionName = getActionNameGen('image')
export const LOAD_IMAGE_LIST = getActionName('LOAD_IMAGE_LIST')
export const LOAD_IMAGE_LIST_SUCCESS = getActionName('LOAD_IMAGE_LIST_SUCCESS')
export const LOAD_IMAGE_LIST_FAIL = getActionName('LOAD_IMAGE_LIST_FAIL')

export const loadImageList = FSActionCreatorGen(LOAD_IMAGE_LIST)
export const loadImageListSuccess = FSActionCreatorGen(LOAD_IMAGE_LIST_SUCCESS)
export const loadImageListFail = FSActionCreatorGen(LOAD_IMAGE_LIST_FAIL)
