export const SHOW_ADD_MODAL = 'SHOW_ADD_MODAL'

export const showAddModal = (cardId, tabIndex, patientId, patientParams) => {
  console.log(patientId)
  return {
    type: SHOW_ADD_MODAL,
    payload: {
      cardId,
      tabIndex,
      patientId,
      patientParams
    }
  }
}

export const HIDE_ADD_MODAL = 'HIDE_ADD_MODAL'

export const hideAddModal = () => {
  return {
    type: HIDE_ADD_MODAL,
    payload: {}
  }
}

export const SHOW_CREATE_CARD_MODAL = 'SHOW_CREATE_CARD_MODAL'

export const showCreateCardModal = () => {
  return {
    type: SHOW_CREATE_CARD_MODAL,
    payload: {}
  }
}

export const HIDE_CREATE_CARD_MODAL = 'HIDE_CREATE_CARD_MODAL'

export const hideCreateCardModal = () => {
  return {
    type: HIDE_CREATE_CARD_MODAL,
    payload: {}
  }
}
