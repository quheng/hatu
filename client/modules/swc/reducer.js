import * as actions from './action'

const initState = { swcList: [], swcFile: '', result: false }

export default function (state = initState, action) {
  switch (action.type) {
    case actions.LOAD_SWC_LIST:
      return {
        ...state,
        isFetching: true
      }
    case actions.LOAD_SWC_LIST_SUCCESS: {
      const { swcList } = action.payload
      return {
        ...state,
        isFetching: false,
        swcList: swcList
      }
    }
    case actions.LOAD_SWC_LIST_FAIL:
      return {
        ...state,
        isFetching: false,
        hasError: true,
        error: action.payload
      }

    case actions.LOAD_SWC_FILE:
      return {
        ...state,
        isFetching: true
      }
    case actions.LOAD_SWC_FILE_SUCCESS: {
      const { swcFile } = action.payload
      return {
        ...state,
        isFetching: false,
        swcFile: swcFile
      }
    }
    case actions.LOAD_SWC_FILE_FAIL:
      return {
        ...state,
        isFetching: false,
        hasError: true,
        error: action.payload
      }

    case actions.WRITE_SWC_FILE:
      return {
        ...state,
        isFetching: true
      }
    case actions.WRITE_SWC_FILE_SUCCESS: {
      const { swcFile } = action.payload
      return {
        ...state,
        isFetching: false,
        swcFile: swcFile
      }
    }
    case actions.WRITE_SWC_FILE_FAIL:
      return {
        ...state,
        isFetching: false,
        result: false,
        hasError: true,
        error: action.payload
      }
    default:
      return state
  }
}
