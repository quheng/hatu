import * as actions from './action'

const initState = { imageList: [] }

export default function (state = initState, action) {
  switch (action.type) {
    case actions.LOAD_IMAGE_LIST:
      return {
        ...state,
        isFetching: true
      }
    case actions.LOAD_IMAGE_LIST_SUCCESS: {
      const { imageList } = action.payload
      return {
        ...state,
        isFetching: false,
        imageList
      }
    }
    case actions.LOAD_IMAGE_LIST_FAIL:
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
