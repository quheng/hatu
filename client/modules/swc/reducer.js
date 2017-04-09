import * as actions from './action'

const initState = { swcInfo: '' }

export default function (state = initState, action) {
  switch (action.type) {
    case actions.LOAD_SWC:
      return {
        ...state,
        isFetching: true
      }
    case actions.LOAD_SWC_SUCCESS: {
      const swcInfo = action.payload
      return {
        ...state,
        isFetching: false,
        swcInfo
      }
    }
    case actions.LOAD_SWC_FAIL:
      return {
        ...state,
        isFetching: false,
        hasError: true,
        error: action.payload
      }
    default:
      return state
  }
}
