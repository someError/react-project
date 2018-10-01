import React from 'react'
import DataTable from './DataTable'
import { reduceMedicationToTable } from '../../util/index'

const MedicationsSimpleTable = ({ items }) => {
  return <DataTable data={reduceMedicationToTable(items)} />
}

MedicationsSimpleTable.defaultProps = {
  items: []
}

export default MedicationsSimpleTable
