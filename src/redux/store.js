import { createStore, applyMiddleware } from 'redux'
import logger from 'redux-logger'
import { persistStore } from 'redux-persist'
// import thunk from 'redux-thunk'
import createSagaMiddleware from 'redux-saga'

import rootReducer from './root-reducer'
import rootSaga from './root.saga'

const sagaMiddleWare = createSagaMiddleware()

// const middleWares = [thunk]
const middleWares = [sagaMiddleWare]

if (process.env.NODE_ENV === 'development') {
  middleWares.push(logger)
}

const store = createStore(rootReducer, applyMiddleware(...middleWares))

sagaMiddleWare.run(rootSaga)

export const persistor = persistStore(store)

export default store
