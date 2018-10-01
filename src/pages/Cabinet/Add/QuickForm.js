import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { injectIntl, FormattedMessage } from 'react-intl'

import ForRoles from '../../../components/ForRoles'
import { Tile, TileIcon, TileContent } from '../../../components/Tile'
import { showAddModal } from '../../../redux/modals/actions'
import Card from '../../../components/Card/Card'
import FeatherIcon from '../../../components/Icons/FeatherIcon'
import { withPatientParams } from '../../../components/PatientProvider/PatientParamsProvider'

import commonIntlMessages from '../../../i18n/common-messages'

const createClassName = (index, activeIndex) => {
  return classNames('react-tabs__tab', { 'react-tabs__tab--selected': index === activeIndex })
}

const QuickForm = ({ cardId, patientId, showAddModal, activeTab, patientParams, user, intl }) => {
  return <Card>
    <div className='scroll-wrap'>
      <Tile className='tabs-container record-form-nav' centered>
        <TileIcon>
          { intl.formatMessage(commonIntlMessages.addFormTabsLabel) }:
        </TileIcon>
        <TileContent>
          <ul className='react-tabs__tab-list'>
            <li onClick={() => { showAddModal(cardId, 0, patientId, patientParams) }} className={createClassName(0, activeTab)}>
              <Tile centered>
                <TileIcon><FeatherIcon icon='clipboard' size={22} /></TileIcon>
                <TileContent>{ intl.formatMessage(commonIntlMessages.addFormRecordTab) }</TileContent>
              </Tile>
            </li>
            <ForRoles disallow={['assistant']}>
              <li onClick={() => { showAddModal(cardId, 1, patientId, patientParams) }} className={createClassName(1, activeTab)}>
                <Tile centered>
                  <TileIcon><FeatherIcon icon='pill' size={22} /></TileIcon>
                  <TileContent>{ intl.formatMessage(commonIntlMessages.addFormMedicationTab) }</TileContent>
                </Tile>
              </li>
              <li onClick={() => { showAddModal(cardId, 2, patientId, patientParams) }} className={createClassName(2, activeTab)}>
                <Tile centered>
                  <TileIcon><FeatherIcon icon='file-text' size={22} /></TileIcon>
                  <TileContent>{ intl.formatMessage(commonIntlMessages.addFormParametersTab) }</TileContent>
                </Tile>
              </li>
              <li onClick={() => { showAddModal(cardId, 3, patientId, patientParams) }} className={createClassName(3, activeTab)}>
                <Tile centered>
                  <TileIcon><FeatherIcon icon='check-square' size={22} /></TileIcon>
                  <TileContent>{ intl.formatMessage(commonIntlMessages.addFormEventTab) }</TileContent>
                </Tile>
              </li>
            </ForRoles>
          </ul>
        </TileContent>
      </Tile>
    </div>
    <div onClick={() => { showAddModal(cardId, activeTab, patientId, patientParams) }} className='record-add-placeholder'>
      <ForRoles allow={['patient']}>
        <FormattedMessage id='add.form.tabs.placeholder_patient' description='Подсказка в форме доавбки для пациента' defaultMessage='Как себя чувствуете?' />
      </ForRoles>
      <ForRoles allow={['doctor', 'assistant']}>
        <FormattedMessage id='add.form.tabs.placeholder_doctor' description='Подсказка в форме доавбки для врача' defaultMessage='Добавьте запись в медкарту пациента' />
      </ForRoles>
    </div>
  </Card>
}

QuickForm.defaultProps = {
  activeTab: 1
}

const mapDispatchToProps = (dispatch) => {
  return {
    showAddModal: function (...args) {
      dispatch(showAddModal(...args))
    }
  }
}

export default withPatientParams(injectIntl(connect(({user}) => ({user}), mapDispatchToProps)(QuickForm)))
