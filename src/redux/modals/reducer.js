import {
  SHOW_ADD_MODAL,
  HIDE_ADD_MODAL,
  SHOW_CREATE_CARD_MODAL,
  HIDE_CREATE_CARD_MODAL
} from './actions'

const DEFAULT_STATE = {
  isAddModalVisible: false,
  isCreateCardModalVisible: false,
  addModalTab: 0,
  addModalStartPosition: {}
}

export default function cards (state = DEFAULT_STATE, action) {
  const { type, payload } = action

  let newState

  switch (type) {
    case SHOW_ADD_MODAL:
      newState = {
        isAddModalVisible: true,
        cardId: payload.cardId,
        patientId: payload.patientId,
        patientParams: payload.patientParams,
        addModalTab: payload.tabIndex,
        addModalStartPosition: {}
      }

      if (payload.anchorDomEl) {
        newState.addModalStartPosition = {
          left: `${payload.anchorDomEl.offsetLeft}px`,
          top: `${payload.anchorDomEl.offsetTop}px`,
          width: `${payload.anchorDomEl.offsetWidth}px`
        }
      }

      return {
        ...state,
        ...newState
      }
    case HIDE_ADD_MODAL:
      newState = {
        isAddModalVisible: false
      }

      return {
        ...state,
        ...newState
      }
    case SHOW_CREATE_CARD_MODAL:
      newState = {
        isCreateCardModalVisible: true
      }

      return {
        ...state,
        ...newState
      }
    case HIDE_CREATE_CARD_MODAL:
      newState = {
        isCreateCardModalVisible: false
      }

      return {
        ...state,
        ...newState
      }
    default:
      return state
  }
}
