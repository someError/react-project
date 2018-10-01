import React from 'react'
import DataTable from './DataTable'
import { reduceMedicationToTable } from '../../util'
import { injectIntl } from 'react-intl'

const MedicationsTable = ({ items, className, dataModifier, intl }) => {
  let data = reduceMedicationToTable(items, intl.formatMessage)

  if (dataModifier) {
    data = dataModifier(data)
  }

  return <DataTable className={className} data={data} />
}

MedicationsTable.defaultProps = {
  items: []
}

export default injectIntl(MedicationsTable)
