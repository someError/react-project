import React, { Component } from 'react'
import { Link, Route, Redirect } from 'react-router-dom'
import { FormattedMessage, injectIntl } from 'react-intl'

import Cards from '../Cards'
import Template from '../../../components/Template'
import api from '../../../api'
import { Card, CardBody, CardFooter } from '../../../components/Card'
import { Tile, TileIcon, TileContent } from '../../../components/Tile'
import { Avatar } from '../../../components/Avatar'
import Spinner from '../../../components/Loader/Spinner'

import './Patient.css'
import Button from '../../../components/Button/index'
import FeatherIcon from '../../../components/Icons/FeatherIcon'
import Monitoring from './Monitoring'
import Events from '../Events'
import withUser from '../../../redux/util/withUser'
import ScheduleRecord from '../Schedule/ScheduleRecord'
import Modal from '../../../components/Modal'
import PatientParamsProvider from '../../../components/PatientProvider/PatientParamsProvider'

import commonIntlMessages from '../../../i18n/common-messages'

class Patient extends Component {
  constructor () {
    super()

    this.state = {
      loading: true
    }
  }

  componentDidMount () {
    const { patientId } = this.props.match.params

    this.setState({
      loading: true
    })

    this.req = api.getPatient(patientId)

    this.req
      .then(({ data: { data } }) => {
        this.setState({
          ...data,
          loading: false
        })
      })
  }

  renderOrganizations () {
    const { organizations } = this.state
    if (!organizations.length) {
      return null
    } else {
      return organizations.map((org) => org.name).join(',')
    }
  }

  render () {
    const { props, state } = this
    const { patientId } = props.match.params

    const { intl } = props

    if (this.state.loading) {
      return <Spinner />
    }

    const cardId = this.state.card.id

    if (props.location.pathname === `/cabinet/patients/${patientId}`) {
      return <Redirect to={`/cabinet/patients/${patientId}/${cardId}/records`} />
    }

    return <Template>
      <div className='record-container'>
        <Card className='patient-info'>
          <CardBody>
            <Tile>
              <TileIcon>
                <Avatar size='lg' src={state.avatar && state.avatar.url} initial={`${this.state.firstName[0]}${this.state.lastName[0]}`} />
              </TileIcon>
              <TileContent>
                <span className='text-sm color-green'>{ this.state.self ? intl.formatMessage(commonIntlMessages.patientIsMine) : null } { this.renderOrganizations() }</span>
                <h2 className=''>{ this.state.firstName } { this.state.lastName }</h2>
                <div className='patient-links text-sm'>
                  {/* <Link to={`?`}>Подробная информация</Link>{' '} */}
                  {/* <Link to={`?`}>Персональные нормы</Link>{' '} */}
                  {
                    this.props.user.entity_type !== 'assistant' && (
                      <Template>
                        <Link to={`/cabinet/patients/${patientId}`}><FormattedMessage id='patient.link.card' defaultMessage='Медкарта' /></Link>{' '}
                        <Link to={`/cabinet/patients/${patientId}/${cardId}/monitoring`}><FormattedMessage id='patient.link.monitoring' defaultMessage='Мониторинг' /></Link>{' '}
                        <Link to={`/cabinet/patients/${patientId}/events/list`}><FormattedMessage id='patient.link.events' defaultMessage='События' /></Link>{' '}
                        <Link to={`/cabinet/patients/${patientId}/events/calendar`}><FormattedMessage id='patient.link.calendar' defaultMessage='Календарь' /></Link>{' '}
                        <Link to={`/cabinet/patients/${patientId}/events/taskslists`}><FormattedMessage id='patient.link.task_lists' defaultMessage='Списки дел' /></Link>
                        <Link to={`/cabinet/patients/${patientId}/events/taskslines`}><FormattedMessage id='patient.link.task_lines' defaultMessage='Линейки дел' /></Link>
                      </Template>
                    )
                  }
                </div>
              </TileContent>
            </Tile>
          </CardBody>
          <CardFooter>
            {
              !this.state.cardAccess && <Button className='patient-action-button' ghost size='sm'>
                <FeatherIcon icon='lock' size={16} /> { intl.formatMessage(commonIntlMessages.requestAccess) }
              </Button>
            }

            {/* <Button className='patient-action-button' ghost size='sm'> */}
            {/* <FeatherIcon icon='trending-up' size={16} /> Настроить мониторинг */}
            {/* </Button>{' '} */}

            {
              this.props.user && this.props.user.queuesCount > 0 && <Button
                onClick={() => this.setState({showRecordModal: true})}
                className='patient-action-button'
                ghost
                size='sm'
              >{ intl.formatMessage(commonIntlMessages.enrollPatient) }
              </Button>
            }
          </CardFooter>
        </Card>
      </div>

      <PatientParamsProvider patientParams={this.state.physicParameters}>
        <Cards cardAccess={this.state.card.access.type} patientId={patientId} {...props} />

        <Route path={`${props.match.url}/:cardId/monitoring`} render={(pr) => <Monitoring patientId={patientId} {...pr} />} />
        <Route
          path={`${props.match.url}/events`}
          render={(pr) => {
            return <Events
              {...pr}
              cardId={cardId}
              patientId={patientId}
            />
          }}
        />
      </PatientParamsProvider>
      {
        this.state.showRecordModal &&
        <Modal
          onRequestClose={() => {
            this.setState({showRecordModal: false})
          }}
        >
          <ScheduleRecord
            patientId={patientId}
            onSuccess={() => {
              this.setState({showRecordModal: false})
            }}
          />
        </Modal>
      }
    </Template>
  }
}

export default injectIntl(withUser(Patient))
