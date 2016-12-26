import { getActionNameGen, FSActionCreatorGen } from '../FsActionCreatorGen'

const getActionName = getActionNameGen('swc')
export const LOAD_SWC_LIST = getActionName('LOAD_SWC_LIST')
export const LOAD_SWC_LIST_SUCCESS = getActionName('LOAD_SWC_LIST_SUCCESS')
export const LOAD_SWC_LIST_FAIL = getActionName('LOAD_SWC_LIST_FAIL')

export const loadSwcList = FSActionCreatorGen(LOAD_SWC_LIST)
export const loadSwcListSuccess = FSActionCreatorGen(LOAD_SWC_LIST_SUCCESS)
export const loadSwcListFail = FSActionCreatorGen(LOAD_SWC_LIST_FAIL)

export const LOAD_SWC_FILE = getActionName('LOAD_SWC_FILE')
export const LOAD_SWC_FILE_SUCCESS = getActionName('LOAD_SWC_FILE_SUCCESS')
export const LOAD_SWC_FILE_FAIL = getActionName('LOAD_SWC_FILE_FAIL')

export const loadSwcFile = FSActionCreatorGen(LOAD_SWC_FILE)
export const loadSwcFileSuccess = FSActionCreatorGen(LOAD_SWC_FILE_SUCCESS)
export const loadSwcFileFail = FSActionCreatorGen(LOAD_SWC_FILE_FAIL)

export const WRITE_SWC_FILE = getActionName('WRITE_SWC_FILE')
export const WRITE_SWC_FILE_SUCCESS = getActionName('WRITE_SWC_FILE_SUCCESS')
export const WRITE_SWC_FILE_FAIL = getActionName('WRITE_SWC_FILE_FAIL')

export const writeSwcFile = FSActionCreatorGen(WRITE_SWC_FILE)
export const writeSwcFileSuccess = FSActionCreatorGen(WRITE_SWC_FILE_SUCCESS)
export const writeSwcFileSwcFileFail = FSActionCreatorGen(WRITE_SWC_FILE_FAIL)
