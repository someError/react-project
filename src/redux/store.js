import { createStore, applyMiddleware, compose } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction'
import thunk from 'redux-thunk'

import rootReducer from './rootReducer'

const composeEnhancers = composeWithDevTools({})

let enhancers

if (process.env.NODE_ENV !== 'production') {
  enhancers = composeEnhancers(applyMiddleware(thunk))
} else {
  enhancers = compose(applyMiddleware(thunk))
}

const store = createStore(rootReducer, { }, enhancers)

export default store
