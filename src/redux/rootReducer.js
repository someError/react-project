import { combineReducers } from 'redux'

import { reducer as user } from './user'
import { reducer as cards } from './cards'
import { reducer as reference } from './reference'
import { reducer as modals } from './modals'
import { reducer as doctors } from './doctors'
import { reducer as organizations } from './organizations'
import { reducer as queues } from './queue'
import { reducer as patients } from './patients'
import { reducer as records } from './requests'

export default combineReducers({
  user,
  cards,
  reference,
  modals,
  doctors,
  organizations,
  queues,
  patients,
  records
})
