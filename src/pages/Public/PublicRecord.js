import React, { Component } from 'react'
import api from '../../api'
import { injectIntl } from 'react-intl'

import { OverlaySpinner } from '../../components/Loader'
import Record from '../Cabinet/Cards/EntityViews/Record'

import commonIntlMessages from '../../i18n/common-messages'

class PublicRecord extends Component {
  constructor () {
    super()

    this.state = {
      loading: true,
      failed: false
    }
  }

  componentDidMount () {
    api.getRecordByToken(this.props.match.params.token)
      .then(({ data: { data } }) => {
        this.setState({
          loading: false,
          ...data.result
        })
      })
      .catch(() => {
        this.setState({
          loading: false,
          failed: true
        })
      })
  }

  render () {
    if (this.state.loading) {
      return <OverlaySpinner />
    }

    return <div className='main-col-layout'>
      <div className='main-col-layout__left' />
      <div className='main-col-layout__main'>
        <br /><br />
        {
          !this.state.failed
            ? <Record
              {...this.state}
              shared
            />
            : <h2 style={{ textAlign: 'center' }}>{ this.props.intl.formatMessage(commonIntlMessages.accessDenied) }</h2>
        }
      </div>
      <div className='main-col-layout__right' />
    </div>
  }
}

export default injectIntl(PublicRecord)
