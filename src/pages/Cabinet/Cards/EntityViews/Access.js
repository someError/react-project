import React, { Component } from 'react'
import { injectIntl } from 'react-intl'
import { Link } from 'react-router-dom'

import Card from '../../../../components/Card/Card'
import CardBody from '../../../../components/Card/CardBody'
import { Tile, TileContent, TileAction } from '../../../../components/Tile'
import MediaQuery from '../../../../components/MediaQuery'
import Button from '../../../../components/Button'
import Template from '../../../../components/Template'
import { noop } from '../../../../util'
import commonIntlMessages from '../../../../i18n/common-messages'

import moment from 'moment'
import FeatherIcon from '../../../../components/Icons/FeatherIcon'

import './Access.css'
import api from '../../../../api'

class AccessCard extends Component {
  constructor () {
    super()

    this.state = {
      loading: false
    }
  }

  remove () {
    this.setState({
      loading: true
    })

    api.removeAccessRule(this.props.id)
      .then(() => {
        this.props.onRemove()

        this.setState({
          loading: false
        })
      })
  }

  confirm () {
    this.setState({
      loading: true
    })

    api.confirmAccess(this.props.id)
      .then(({ data: { data } }) => {
        this.setState({
          loading: false
        })

        this.props.onConfirm(data)
      })
  }

  render () {
    const { doctor, organization, intl, ...access } = this.props

    return <Card className='access-card' key={access.id}>
      <CardBody>
        <Template if={access.status === 'allowed'}>
          <div className='access-card__controls'>
            {/* <span className='access-controls__item'><FeatherIcon icon='edit-2' size={14} /> Редактировать</span> */}
            {/* <span className='access-controls__item'><FeatherIcon icon='power' size={14} /> Отключить</span> */}
            <span onClick={() => { this.remove() }} className='access-controls__item color-red'><FeatherIcon icon='x' size={14} /> { intl.formatMessage(commonIntlMessages.remove) }</span>
          </div>
        </Template>

        { access.section && <span className='record-section-path'>{ access.section.name }</span> }
        { doctor && <h4 className='access-card__name'><Link to={`/cabinet/doctors/${doctor.id}`}>{ doctor.firstName } { doctor.lastName }</Link></h4> }
        { !doctor && organization && <h4 className='access-card__name'><Link to={`/cabinet/organizations/${organization.id}`}>{ organization.legalName }</Link></h4> }

        { access.requestText && <div className='access-card__text'>{ access.requestText }</div> }

        <Template if={access.status !== 'allowed'}>
          <Tile centered>
            <TileContent>
              { intl.formatMessage(commonIntlMessages.accessType) }: { access.type === 'read' ? intl.formatMessage(commonIntlMessages.accessRead) : intl.formatMessage(commonIntlMessages.accessReadWrite) }
            </TileContent>
            <TileAction>
              <Button onClick={() => { this.confirm() }} size='xs'>{ intl.formatMessage(commonIntlMessages.confirm) }</Button>{' '}
              <Button onClick={() => { this.remove() }} ghost size='xs'>{ intl.formatMessage(commonIntlMessages.decline) }</Button>
            </TileAction>
          </Tile>
        </Template>

        <Template if={access.status === 'allowed'}>
          <MediaQuery rule='(min-width: 768px)'>
            <span className='access-card__status'>{ intl.formatMessage(commonIntlMessages.statusActive) }</span>
          </MediaQuery>
          <span className='access-card__meta'><span className='color-gray'>{ intl.formatMessage(commonIntlMessages.accessType) }:</span> { access.type === 'read' ? intl.formatMessage(commonIntlMessages.accessRead) : intl.formatMessage(commonIntlMessages.accessReadWrite) }</span>
          <span className='access-card__meta'><span className='color-gray'>{ intl.formatMessage(commonIntlMessages.activePeriodLabel) }:</span> { intl.formatMessage(commonIntlMessages.prepositionFrom) } { moment(access.allowedFrom).format('DD.MM.YYYY') } { access.allowedTo ? <Template>{ intl.formatMessage(commonIntlMessages.prepositionUntil) } { moment(access.allowedTo).format('DD.MM.YYYY') }</Template> : null }</span>
        </Template>
      </CardBody>
    </Card>
  }
}

AccessCard.defaultProps = {
  onRemove: noop,
  onConfirm: noop
}

export default injectIntl(AccessCard)
