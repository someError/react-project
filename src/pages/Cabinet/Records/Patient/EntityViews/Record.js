import React, {Component} from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import { injectIntl } from 'react-intl'
import moment from 'moment'
import { changeRecord } from '../../../../../redux/requests/actions'
import api from '../../../../../api'
import { Card, CardBody } from '../../../../../components/Card'
import { Tile, TileContent, TileAction } from '../../../../../components/Tile'
import Button from '../../../../../components/Button'
import Template from '../../../../../components/Template'
import { Avatar } from '../../../../../components/Avatar'
import MediaQuery from '../../../../../components/MediaQuery'
import { OverlaySpinner } from '../../../../../components/Loader'

import './Record.css'
import commonIntlMessages from '../../../../../i18n/common-messages'

const statuses = {
  not_confirmed: commonIntlMessages.receptionStatusNotConfirmed,
  patient_missing: commonIntlMessages.receptionStatusMissed,
  completed: commonIntlMessages.receptionStatusCompleted,
  confirmed: commonIntlMessages.receptionStatusConfirmed,
  patient_canceled: commonIntlMessages.receptionStatusCanceledByPatient
}

class Record extends Component {
  constructor ({match, location, history, ...props}) {
    super()
    this.state = {
      ...props
    }
  }

  componentWillMount () {
    const { match, modal } = this.props

    if (match && match.params.id && modal) {
      this.setState({detailLoading: true})
      api.getRequest(match.params.id)
        .then(({data: { data }}) => {
          this.setState({
            ...data,
            detailLoading: false
          })
        })
    }
  }

  renderButtons () {
    const { state, props } = this
    const status = props.status || state.status
    const cancelEnable = state.timeBox && (moment.utc().add(1, 'hours').valueOf() < moment(state.timeBox.startTime).valueOf())

    const { intl } = props

    return (
      <Template>
        {
          (status === 'not_confirmed' || status === 'confirmed') && cancelEnable && (
            <Button
              onClick={() => {
                this.setState({deleteLoading: true})
                api.removeRequest(state.id)
                  .then(({data: {data}}) => {
                    this.setState({
                      deleteLoading: false,
                      status: 'patient_canceled'
                    })
                    props.changeRequest(data)
                  })
              }}
              loading={state.deleteLoading}
              size='xs'
              ghost
            >
              { intl.formatMessage(commonIntlMessages.cancel) }
            </Button>
          )
        }
        {
          status === 'not_confirmed' && (
            <Button
              onClick={() => {
                this.setState({confirmLoading: true})
                api.confirmRequest(state.id)
                  .then(({data: {data}}) => {
                    this.setState({
                      confirmLoading: false,
                      status: 'confirmed'
                    })
                    props.changeRequest(data)
                  })
              }}
              loading={state.confirmLoading}
              size='xs'
            >
              { intl.formatMessage(commonIntlMessages.confirm) }
            </Button>
          )
        }
      </Template>
    )
  }

  render () {
    const { props, state } = this
    const { timeBox, organization, doctor } = state

    const { intl } = this.props

    if (props.match && props.match.params.id && state.detailLoading) {
      return <OverlaySpinner />
    }

    const status = props.status || state.status

    return <div className='record-container record-container--schedule'>
      <Card className={`record-new record-card--${classNames(status)}`}>
        <Template>
          <Tile centered className='record-controls'>
            <TileContent>
              <i>{ intl.formatMessage(statuses[status]) }</i>
            </TileContent>
            <MediaQuery rule='(min-width: 768px)'>
              <TileAction>
                { this.renderButtons() }
              </TileAction>
            </MediaQuery>
          </Tile>
          <CardBody className='patient-record-info'>
            <h3>
              {/* FIXME: ви вот как лучше воткнуть intl? */}
              Прием {organization ? 'в клинике ' : 'у врача ' } в { moment.utc(timeBox.startTime).format(' dddd D MMMM YYYY в HH:mm') }
            </h3>
            <div className='patient-record-info__address'>
              { intl.formatMessage(commonIntlMessages.labelAddress) }: {(organization && organization.address) || (doctor && doctor.region.name)}
            </div>
            <div className='patient-record-info__rows'>
              {
                organization && (
                  <div className='patient-record-info__row'>
                    <div>{ intl.formatMessage(commonIntlMessages.labelOrg) }: </div>
                    <div>
                      <Link to={`/cabinet/organizations/${organization.id}`}>
                        <Avatar
                          size='sm'
                          url={organization.avatar && organization.avatar.url}
                          initial={`${organization.name[0]}`}
                        />
                        { organization.name }
                      </Link>
                    </div>
                  </div>
                )
              }
              {
                doctor && (
                  <div className='patient-record-info__row'>
                    <div>{ intl.formatMessage(commonIntlMessages.labelDoctor) }: </div>
                    <div>
                      <Link to={`/cabinet/doctors/${doctor.id}`}>
                        <MediaQuery rule='(min-width: 768px)'>
                          <Avatar
                            size='sm'
                            src={doctor.avatar && doctor.avatar.url}
                            initial={`${doctor.firstName[0]}${doctor.lastName[0]}`}
                          />
                        </MediaQuery>
                        {doctor.lastName} {doctor.firstName} {doctor.middleName}
                      </Link>
                    </div>
                  </div>
                )
              }
            </div>
          </CardBody>
          <MediaQuery rule='(max-width: 767px)'>
            <CardBody className='record-bottom-nav'>
              { this.renderButtons() }
            </CardBody>
          </MediaQuery>
        </Template>
      </Card>
    </div>
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeRequest: function (data) {
      return dispatch(changeRecord(data))
    }
  }
}

export default injectIntl(connect(null, mapDispatchToProps)(Record))
