import React, {Component} from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import moment from 'moment'
import api from '../../../../../api'
import { Avatar } from '../../../../../components/Avatar'
import { Card, CardBody } from '../../../../../components/Card'
import { Tile, TileContent, TileAction, TileIcon } from '../../../../../components/Tile'
import Button from '../../../../../components/Button'
import Template from '../../../../../components/Template'
import { removeRequest, changeRecord } from '../../../../../redux/requests/actions'
import { Select } from '../../../../../components/Form'
import { OverlaySpinner } from '../../../../../components/Loader'
import MediaQuery from '../../../../../components/MediaQuery'

import commonIntlMessages from '../../../../../i18n/common-messages'

const statuses = {
  not_confirmed: commonIntlMessages.receptionStatusNotConfirmed,
  patient_missing: commonIntlMessages.receptionStatusMissed,
  completed: commonIntlMessages.receptionStatusCompleted,
  confirmed: commonIntlMessages.receptionStatusConfirmed
}

class Record extends Component {
  constructor ({match, history, location, ...props}) {
    super()

    this.state = {
      ...props,
      deleting: false
    }
    this.changeStatus = this.changeStatus.bind(this)
  }

  changeStatus (status) {
    const _status = status
    const { id, timeBox } = this.state
    api.putRequest(id, {status, timeBox: timeBox.id})
      .then(({data: { data }}) => {
        this.setState({status: _status})
        this.props.changeRequest(data)
      })
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
    const { state } = this
    const { intl } = this.props

    return (
      <Template>
        <Button
          ghost
          loading={state.deleting}
          onClick={
            () => {
              this.setState({ deleting: true })
              this.props.removeRequest(state.id)
                .then(() => {
                  this.setState({deleting: false})
                })
                .catch(() => {
                  this.setState({deleting: false})
                })
            }}
          size='xs'>
          { intl.formatMessage(commonIntlMessages.remove) }
        </Button>
        {
          state.queuesCount ? (
            <Button to={`/cabinet/records/add`} size='xs'>Записать</Button>
          ) : (
            <Button size='xs' to={`/cabinet/schedule/add`}>
              { intl.formatMessage(commonIntlMessages.createScheduleBtn) }
            </Button>
          )
        }
      </Template>
    )
  }

  render () {
    const { state, props } = this
    const { patient, timeBox, createdAt } = state
    const status = props.status || state.status

    const { intl } = props

    if (props.match && props.match.params.id && state.detailLoading) {
      return <OverlaySpinner />
    }

    if (!timeBox) {
      return <div className='record-container record-container--schedule'>
        <Card className={`record-new`}>
          <Template>
            <Tile centered className='record-controls'>
              <TileIcon>
                <Avatar
                  size='lg'
                  url={patient.avatar && patient.avatar.url}
                  initial={`${patient.firstName[0]}${patient.lastName[0]}`}
                />
              </TileIcon>
              <TileContent>
                <div className='record-title'>{`${patient.firstName} ${patient.lastName}`}</div>
                <div className='color-gray'>{ intl.formatMessage(commonIntlMessages.labelRequestDate) }: { moment(createdAt).format('DD.MM.YYYY') }</div>
              </TileContent>
              <MediaQuery rule='(min-width: 768px)'>
                <TileAction>
                  { this.renderButtons() }
                </TileAction>
              </MediaQuery>
            </Tile>
            {
              (state.dateText || state.timeText || state.info) && (
                <CardBody>
                  <Tile>
                    <TileContent>
                      <div className='columns record-grid'>
                        {
                          state.dateText && <div className='column col-6'>
                            <div>{ intl.formatMessage(commonIntlMessages.desiredReceptionDays) }</div>
                            <div>{ state.dateText }</div>
                          </div>
                        }
                        {
                          state.timeText && <div className='column col-6'>
                            <div>{ intl.formatMessage(commonIntlMessages.desiredReceptionTime) }</div>
                            <div>{ state.timeText }</div>
                          </div>
                        }
                        {
                          state.info && <div className='column col-6'>
                            <div>{ intl.formatMessage(commonIntlMessages.additionalReceptionInfo) }</div>
                            <div>{ state.info }</div>
                          </div>
                        }
                      </div>
                    </TileContent>
                  </Tile>
                </CardBody>
              )
            }
            <MediaQuery rule='(max-width: 767px)'>
              <CardBody className='record-bottom-nav'>
                { this.renderButtons() }
              </CardBody>
            </MediaQuery>
          </Template>
        </Card>
      </div>
    }

    return <div className='record-container record-container--schedule'>
      <Card className={`record-new record-card--${classNames(status)}`}>
        <Template>
          <Tile centered className='record-controls'>
            <TileContent>
              <i style={{marginRight: '10px'}}>{ intl.formatMessage(statuses[status]) }</i>
              <Select
                className='record-container__schedule-select'
                value='default'
                onChange={(e) => this.changeStatus(e.target.value)}
              >
                <option value='default'>{ intl.formatMessage(commonIntlMessages.changeStatus) }</option>
                <option value='confirmed'>{ intl.formatMessage(statuses.confirmed) }</option>
                <option value='completed'>{ intl.formatMessage(statuses.completed) }</option>
                <option value='patient_missing'>{ intl.formatMessage(statuses.patient_missing) }</option>
              </Select>
            </TileContent>
            {
              status === 'completed' && patient.card && <TileAction>
                <Button to={`/cabinet/cards/${patient.card.id}/records`} size='xs'>{ intl.formatMessage(commonIntlMessages.createRecordButton) }</Button>
              </TileAction>
            }
          </Tile>
          <CardBody>
            <Tile>
              <TileIcon>
                <Avatar
                  size='lg'
                  src={patient.avatar && patient.avatar.url}
                  initial={`${patient.firstName[0]}${patient.lastName[0]}`}
                />
              </TileIcon>
              <TileContent>
                <div className='record-title'>{`${patient.firstName} ${patient.lastName}`}</div>
                <div className='record-info color-gray'>
                  <span>{ moment(timeBox.startTime).utc().format('DD.MM.YYYY') }</span>
                  <span>
                    { moment(timeBox.startTime).utc().format('HH:mm') } — { moment(timeBox.endTime).utc().format('HH:mm') }
                  </span>
                  {/* <span> */}
                  {/* { timeBox.queue && timeBox.queue.serviceType.name } */}
                  {/* </span> */}
                </div>
              </TileContent>
            </Tile>
          </CardBody>
        </Template>
      </Card>
    </div>
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    removeRequest: function (id) {
      return dispatch(removeRequest(id))
    },

    changeRequest: function (data) {
      return dispatch(changeRecord(data))
    }
  }
}

export default injectIntl(connect(null, mapDispatchToProps)(Record))
