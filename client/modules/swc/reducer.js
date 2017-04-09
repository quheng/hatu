import * as actions from './action'

const initState = { swc: '' }

export default function (state = initState, action) {
  switch (action.type) {
    case actions.LOAD_SWC:
      return {
        ...state,
        isFetching: true
      }
    case actions.LOAD_SWC_SUCCESS: {
      const { swc } = action.payload
      return {
        ...state,
        isFetching: false,
        swc
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
