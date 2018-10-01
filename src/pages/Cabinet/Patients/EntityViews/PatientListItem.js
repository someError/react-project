import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { injectIntl, defineMessages } from 'react-intl'

import { Card, CardBody } from '../../../../components/Card'
import { Tile, TileContent, TileIcon, TileAction } from '../../../../components/Tile'
import { Avatar } from '../../../../components/Avatar'
import Button from '../../../../components/Button'
import FeatherIcon from '../../../../components/Icons/FeatherIcon'

import './PatientListItem.css'
import Template from '../../../../components/Template'
import Modal from '../../../../components/Modal'
import RequestAccessModal from '../Form/RequestAccessModal'
import InviteModal from '../Form/Invite'
import withUser from '../../../../redux/util/withUser'
import ScheduleRecord from '../../Schedule/ScheduleRecord'

import commonIntlMessages from '../../../../i18n/common-messages'

const messages = defineMessages({
  recordsCount: {
    id: 'patients.records.count',
    defaultMessage: `{count, plural, 
    one {запись}
    few {записи}
    other {записей}
    }`
  },
  draftsPlural: {
    id: 'patients.drafts.count',
    defaultMessage: `{count} {count, plural,
    one {черновик}
    few {черновика}
    other {черновиков}
    }`
  }
})

class PatientListItem extends Component {
  constructor () {
    super()

    this.state = {
      showRequestAccessModal: false,
      showInviteModal: false
    }
  }

  render () {
    const { props } = this
    let { card, user } = props
    const { intl } = props

    const title = `${props.lastName} ${props.firstName}`

    return <Card>
      <CardBody className='l-user-card'>
        <Tile>
          <TileContent className='l-user-card__content l-user-card__content--patient'>
            <Tile>
              <TileIcon>
                <Avatar size='xl' initial={`${props.lastName[0]}${props.firstName[0]}`} src={props.avatar && props.avatar.url} />
              </TileIcon>
              <TileContent>
                <h4 className='patient-name'>
                  {
                    card && user.entity_type !== 'registry'
                      ? <Link to={`/cabinet/patients/${props.id}/${card.id}/records`}>{ title }</Link>
                      : title
                  }{' '}
                  { props.self && <span className='text-weight-normal text-xs color-green'>{ intl.formatMessage(commonIntlMessages.patientIsMine) }</span> }
                </h4>

                <div className='patient-counts'>
                  {
                    card && card.info.signCount > 0 &&
                      <span className='color-gray text-xs' style={{ marginRight: '1rem' }}>
                        <FeatherIcon icon='clipboard' size={18} />{' '}
                        { props.intl.formatMessage(commonIntlMessages.recordsPlural, { count: card.info.signCount }) }{' '}
                        { !!card.info.newCount && <span className='draft-mark'>{ props.intl.formatMessage(messages.draftsPlural, { count: card.info.newCount }) }</span> }
                      </span>
                  }

                  {
                    props.cardAccess && props.cardAccess.status === 'allowed'
                      ? <span className='access-card__meta' style={{ marginLeft: '0' }}>
                        <span className='color-gray'>{ intl.formatMessage(commonIntlMessages.accessType) }:</span> { props.cardAccess.type === 'read' ? intl.formatMessage(commonIntlMessages.accessRead) : intl.formatMessage(commonIntlMessages.accessReadWrite) }
                      </span>
                      : null
                  }
                </div>
              </TileContent>
            </Tile>
          </TileContent>
          {
            user.entity_type === 'assistant' && ((props.cardAccess && props.cardAccess.type !== 'read_write') || !card)
              ? null
              : <TileAction className='l-user-card__action'>
                {
                  card
                    ? (
                      props.cardAccess && props.cardAccess.type === 'read_write'
                        ? user.entity_type !== 'registry' && <Button onClick={() => { props.onAddClick(props.card.id, 0, props.id) }} className='patient-action-button' ghost size='sm'>
                          <FeatherIcon icon='clipboard' size={16} /> { intl.formatMessage(commonIntlMessages.addRecordBtn) }
                        </Button>
                        : <Button onClick={() => { this.setState({showRequestAccessModal: true}) }} className='patient-action-button' ghost size='sm'>
                          <FeatherIcon icon='lock' size={16} /> { intl.formatMessage(commonIntlMessages.requestAccess) }
                        </Button>
                    )
                    : <Template>
                      {
                        props.cardAccess && props.cardAccess.status === 'requested'
                          ? <Button className='patient-action-button' disabled ghost size='sm'>
                            <FeatherIcon icon='lock' size={16} /> { intl.formatMessage(commonIntlMessages.accessRequested) }
                          </Button>
                          : <Template>
                            <Button onClick={() => { this.setState({showRequestAccessModal: true}) }} className='patient-action-button' ghost size='sm'>
                              <FeatherIcon icon='lock' size={16} /> { intl.formatMessage(commonIntlMessages.requestAccess) }
                            </Button>
                          </Template>
                      }
                    </Template>
                }

                {
                  props.status === 'new' &&
                  <Template>
                    <Button onClick={() => { this.setState({ showInviteModal: true }) }} className='patient-action-button' ghost size='sm'><FeatherIcon icon='mail' size={16} /> { intl.formatMessage(commonIntlMessages.invitePatient) }</Button>

                    {
                      this.state.showInviteModal &&
                      <InviteModal
                        onRequestClose={() => {
                          this.setState({ showInviteModal: false })
                        }}
                        patientId={props.id}
                      />
                    }
                  </Template>
                }

                {
                  user && user.queuesCount > 0 && (
                    <Button onClick={() => this.setState({showRecordModal: true})} className='patient-action-button' ghost size='sm'>{ intl.formatMessage(commonIntlMessages.enrollPatient) }</Button>
                  )
                }
              </TileAction>
          }
        </Tile>
      </CardBody>

      {
        this.state.showRequestAccessModal &&
        <RequestAccessModal
          onRequestClose={() => {
            this.setState({showRequestAccessModal: false})
          }}
          hasReadAccess={props.cardAccess && props.cardAccess.type === 'read'}
          patientId={props.id}
          onSuccess={() => {
            this.setState({showRequestAccessModal: false})
          }}
        />
      }

      {
        this.state.showRecordModal &&
        <Modal
          onRequestClose={() => {
            this.setState({showRecordModal: false})
          }}
        >
          <ScheduleRecord
            patientId={props.id}
            onSuccess={() => {
              this.setState({showRecordModal: false})
            }}
          />
        </Modal>
      }

    </Card>
  }
}

export default injectIntl(withUser(PatientListItem))
