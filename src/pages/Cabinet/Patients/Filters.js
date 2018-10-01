import React from 'react'
import qs from 'qs'
import Template from '../../../components/Template'
import Collabsible from '../../../components/Collapsible'
import { Checkbox } from '../../../components/Form'
import { parseSearchString } from '../../../util'

const Filters = ({ location, history }) => {
  const query = parseSearchString(location.search)

  return <Template>
    <Collabsible
      className='filter-collapsible'
      triggerClassName='filter-collapsible-trigger'
      title='Тип пациента'
      disabled
      active
    >
      <ul className='filters-list'>
        <li>
          <Checkbox
            onChange={(e) => {
              history.push({
                search: qs.stringify({
                  ...query,
                  patientType: e.target.checked ? 'self' : ''
                })
              })
            }}
            checked={query.patientType === 'self'}
            label='Собственные пациенты'
          />
        </li>
        <li>
          <Checkbox
            onChange={(e) => {
              history.push({
                search: qs.stringify({
                  ...query,
                  patientType: e.target.checked ? 'other' : ''
                })
              })
            }}
            checked={query.patientType === 'other'}
            label='Чужие пациенты'
          />
        </li>
      </ul>
    </Collabsible>

    <Collabsible
      className='filter-collapsible'
      triggerClassName='filter-collapsible-trigger'
      title='Доступ к карте'
      disabled
      active
    >
      <ul className='filters-list'>
        <li>
          <Checkbox
            label='Чтение'
          />
        </li>
        <li>
          <Checkbox
            label='Чтение и запись'
          />
        </li>
      </ul>
    </Collabsible>
  </Template>
}

export default Filters
