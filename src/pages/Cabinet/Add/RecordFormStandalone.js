import React from 'react'
import { connect } from 'react-redux'
import { RecordForm } from '../Cards/Form/RecordForm'
import { noop } from '../../../util'

const RecordFormStandalone = (props) => {
  const { section } = props
  let recordType = 'detailed'

  if (section) {
    if (section.recordPersonalDiary) {
      recordType = 'personal'
    } else if (section.recordDrug) {
      recordType = 'medications'
    }
  }

  return <RecordForm
    onSuccess={props.onSuccess}
    recordType={recordType}
    cardId={props.cardId || 'e993f50e-cb13-3f84-8ae6-33c911269fc6'}
    sections={props.section ? [] : props.sections.filter((s) => !s.recordPersonalDiary && !s.recordDrug)}
    section={props.section}
  />
}

RecordFormStandalone.defaultProps = {
  onSuccess: noop
}

export default connect(({ reference }) => ({ sections: reference.sections }))(RecordFormStandalone)
