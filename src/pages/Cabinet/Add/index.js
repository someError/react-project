import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Tab, TabList, Tabs, TabPanel } from 'react-tabs'
import { injectIntl } from 'react-intl'
import Template from '../../../components/Template'
import { RecordForm } from '../Cards/Form/RecordForm'
import { Tile, TileContent, TileIcon } from '../../../components/Tile'
import FeatherIcon from '../../../components/Icons/FeatherIcon'
import EventForm from '../Events/Form'
import commonIntlMessages from '../../../i18n/common-messages'

import './AddNavigation.css'
import { hideAddModal, showAddModal } from '../../../redux/modals/actions'

const Add = ({ cardId, patientId, sections, tabIndex, eventId, hideAddModal, history, location, user, patientParams, intl }) => {
  console.log('wat', location)
  return <div>
    <Tabs
      onSelect={() => {
        showAddModal(cardId)
      }}
      defaultIndex={tabIndex}>
      <div className='tabs-container scroll-wrap'>
        <Tile className='record-form-nav' centered>
          <TileIcon>
            { intl.formatMessage(commonIntlMessages.addFormTabsLabel) }:
          </TileIcon>
          <TileContent>
            <TabList>
              <Tab>
                <Tile centered>
                  <TileIcon><FeatherIcon icon='clipboard' size={22} /></TileIcon>
                  <TileContent>{ intl.formatMessage(commonIntlMessages.addFormRecordTab) }</TileContent>
                </Tile>
              </Tab>
              {
                user.entity_type !== 'assistant' && (
                  <Template>
                    <Tab>
                      <Tile centered>
                        <TileIcon><FeatherIcon icon='pill' size={22} /></TileIcon>
                        <TileContent>{ intl.formatMessage(commonIntlMessages.addFormMedicationTab) }</TileContent>
                      </Tile>
                    </Tab>
                    <Tab>
                      <Tile centered>
                        <TileIcon><FeatherIcon icon='file-text' size={22} /></TileIcon>
                        <TileContent>{ intl.formatMessage(commonIntlMessages.addFormParametersTab) }</TileContent>
                      </Tile>
                    </Tab>
                    <Tab>
                      <Tile centered>
                        <TileIcon><FeatherIcon icon='check-square' size={22} /></TileIcon>
                        <TileContent>{ intl.formatMessage(commonIntlMessages.addFormEventTab) }</TileContent>
                      </Tile>
                    </Tab>
                  </Template>
                )
              }
            </TabList>
          </TileContent>
        </Tile>
      </div>
      <Template>
        <TabPanel>
          <RecordForm
            patientParams={patientParams}
            onSuccess={(data) => {
              hideAddModal()
              // history.replace({
              //   ...location,
              //   search: 'added=' + data.id
              // })
              history.push(`/cabinet/cards/${cardId}/records/${data.id}`)
            }}
            recordType={'detailed'}
            cardId={cardId}
            sections={sections.filter((section) => !section.recordPersonalDiary && !section.recordDrug)}
          />
        </TabPanel>

        {
          user.entity_type !== 'assistant' &&
            (
              <Template>
                <TabPanel>
                  <RecordForm
                    patientParams={patientParams}
                    onSuccess={(data) => {
                      hideAddModal()
                      // history.replace({
                      //   ...location,
                      //   search: 'added=' + data.id
                      // })
                      history.push(`/cabinet/cards/${cardId}/records/${data.id}`)
                    }}
                    recordType={'medications'}
                    cardId={cardId}
                    sections={sections.filter((section) => section.recordDrug)}
                  />
                </TabPanel>
                <TabPanel>
                  <RecordForm
                    patientParams={patientParams}
                    onSuccess={(data) => {
                      hideAddModal()
                      // history.replace({
                      //   ...location,
                      //   search: 'added=' + data.id
                      // })
                      history.push(`/cabinet/cards/${cardId}/records/${data.id}`)
                    }}
                    recordType={'personal'}
                    cardId={cardId}
                    sections={sections.filter((section) => section.recordPersonalDiary)}
                  />
                </TabPanel>
                <TabPanel>
                  <EventForm
                    onSuccess={(data) => {
                      console.log(data)
                      hideAddModal()
                      history.push({
                        pathname: `/cabinet${user.entity_type === 'doctor' ? `/patients/${patientId}` : ''}/events/list/group/${data.id}`
                      })
                    }}
                    patientId={patientId}
                  />
                </TabPanel>
              </Template>
            )
        }
      </Template>
    </Tabs>
  </div>
}

const mapDispatchToProps = (dispatch) => {
  return {
    showAddModal: function (...args) {
      dispatch(showAddModal(...args))
    },
    hideAddModal: function () {
      dispatch(hideAddModal())
    }
  }
}

export default injectIntl(withRouter(connect(({reference, modals, user}) => ({
  user,
  sections: reference.sections,
  cardId: modals.cardId,
  patientId: modals.patientId,
  tabIndex: modals.addModalTab,
  eventId: modals.eventId,
  patientParams: modals.patientParams
}), mapDispatchToProps)(Add)))
