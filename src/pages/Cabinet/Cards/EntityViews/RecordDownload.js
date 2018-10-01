import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Button from '../../../../components/Button'
import FeatherIcon from '../../../../components/Icons/FeatherIcon'
import api from '../../../../api'
import { downloadFile } from '../../../../util'

class RecordDownload extends Component {
  constructor () {
    super()

    this.state = {
      creating: false
    }
  }

  requestFile () {
    this.setState({
      creating: true
    })

    this.req = api.exportCardRecord(this.props.cardId, this.props.recordId)

    this.req
      .then(({ data: { data } }) => {
        downloadFile(data.url, data.fileName)
        this.setState({
          creating: false
        })
      })

    return this.req
  }

  render () {
    return <Button
      size='xs'
      link
      onClick={() => { this.requestFile() }}
      loading={this.state.creating}
    >
      <FeatherIcon size={16} icon='download' />
    </Button>
  }
}

RecordDownload.propTypes = {
  cardId: PropTypes.string.isRequired,
  recordId: PropTypes.string.isRequired
}

export default RecordDownload
