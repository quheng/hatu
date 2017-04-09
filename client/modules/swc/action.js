import { getActionNameGen, FSActionCreatorGen } from '../FsActionCreatorGen'

const getActionName = getActionNameGen('swc')
export const LOAD_SWC = getActionName('LOAD_SWC')
export const LOAD_SWC_SUCCESS = getActionName('LOAD_SWC_SUCCESS')
export const LOAD_SWC_FAIL = getActionName('LOAD_SWC_FAIL')

export const loadSwc = FSActionCreatorGen(LOAD_SWC)
export const loadSwcSuccess = FSActionCreatorGen(LOAD_SWC_SUCCESS)
export const loadSwcFail = FSActionCreatorGen(LOAD_SWC_FAIL)