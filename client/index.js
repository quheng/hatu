import React from 'react'
import ReactDOM from 'react-dom'
import createSagaMiddleware from 'redux-saga'
import rootRoutes from './rootRoutes'
import rootReducer from './rootReducer'
import rootSaga from './rootSaga'

import {
  createStore,
  applyMiddleware
} from 'redux'
import {
  Router,
  browserHistory
} from 'react-router'
import { Provider } from 'react-redux'

const saga = createSagaMiddleware()

let middlewares = [saga]

const store = createStore(
  rootReducer,
  applyMiddleware(...middlewares)
)

saga.run(rootSaga)

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory} routes={rootRoutes} />
  </Provider>,
  document.getElementById('app')
)
