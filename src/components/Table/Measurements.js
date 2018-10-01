import React from 'react'
import DataTable from './DataTable'
import { reduceParametersToTable } from '../../util/index'

const MeasurementsTable = ({ items }) => {
  return <DataTable data={reduceParametersToTable(items)} />
}

MeasurementsTable.defaultProps = {
  items: []
}

export default MeasurementsTable
