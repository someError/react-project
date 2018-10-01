import React from 'react'
import classNames from 'classnames'

import Table from './index'

const DataTable = ({ data, className }) => {
  const headers = data[0].reduce((res, d) => {
    res.push(d.label)

    return res
  }, [])

  return <div className='responsive-xs-table-wrapper'>
    <Table className={classNames('responsive-xs-table', className)}>
      <thead>
        <tr>
          { headers.map((h, i) => <th key={`${h}${i}`}>{ h }</th>) }
        </tr>
      </thead>
      <tbody>
        {
          data.map((d, i) => <tr key={i}>{ d.map((dd, i) => <td data-xs-label={headers[i]} key={i}><div>{ dd.value }</div></td>) }</tr>)
        }
      </tbody>
    </Table>
  </div>
}

export default DataTable
