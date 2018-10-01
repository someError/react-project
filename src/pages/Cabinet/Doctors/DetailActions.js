import React, { Component } from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'

import { CardBody } from '../../../components/Card'
import FeatherIcon from '../../../components/Icons/FeatherIcon'
import Button from '../../../components/Button'
import RequestModal from './Form/RequestModal'
import RequestAccessModal from './Form/RequestAccessModal'

import commonIntlMessages from '../../../i18n/common-messages'

class DoctorsActions extends Component {
  constructor ({ doctors: { detail } }) {
    super()
    this.state = {
      showRequestModal: false,
      access: null,
      initialLoading: true,
      showRequestAccessModal: false
    }
  }

  componentWillReceiveProps (nextProps) {
    const { state } = this
    if (state.initialLoading && !nextProps.doctors.detailLoading) {
      const { doctors: { detail } } = nextProps
      this.setState({
        access: (detail.medicalCardInfo && detail.medicalCardInfo.access) || null,
        initialLoading: false
      })
    }
  }

  render () {
    const { state, props } = this
    const { doctors: { detail }, doctors, intl } = props
    if (doctors.detailLoading) return false
    return <CardBody>
      <div className='columns form-grid'>
        {
          detail.queuesCount ? (
            <div className='column col-12'>
              <Button href='#detailSchedule' fill>
                <FeatherIcon icon='file' size={17} /> <span>{ intl.formatMessage(commonIntlMessages.enroll) }</span>
              </Button>
            </div>
          ) : (
            <div className='column col-12'>
              <Button
                onClick={() => {
                  this.setState({showRequestModal: true})
                }}
                fill
                ghost
              >
                <FeatherIcon icon='clock' size={16} /> <span>{ intl.formatMessage(commonIntlMessages.receptionRequest) }</span>
              </Button>
            </div>
          )
        }
        {
          !state.access && (
            <div className='column col-12'>
              <Button
                onClick={() => {
                  this.setState({showRequestAccessModal: true})
                }}
                fill
                ghost
              >
                <FeatherIcon icon='lock' size={15} /> <span>{ intl.formatMessage(commonIntlMessages.grantAccess) }</span>
              </Button>
            </div>
          )
        }
      </div>
      {
        state.showRequestModal && <RequestModal
          onRequestClose={() => {
            this.setState({showRequestModal: false})
          }}
          {...detail}
        />
      }
      {
        state.showRequestAccessModal && <RequestAccessModal
          onRequestClose={() => {
            this.setState({showRequestAccessModal: false})
          }}
          doctor={detail.id}
          onSubmit={(data) => {
            this.setState({access: data})
          }}
        />
      }
    </CardBody>
  }
}

export default injectIntl(connect(({ doctors }) => ({ doctors }))(DoctorsActions))
