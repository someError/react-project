import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { Card, CardBody, CardHeader } from '../../../../components/Card'
import { FormattedDate, FormattedTime, injectIntl, defineMessages } from 'react-intl'
import Clipboard from 'clipboard'

import FeatherIcon from '../../../../components/Icons/FeatherIcon'
import UserIdentity from '../../../../components/Avatar/UserIdentity'

import './Record.css'
import { Tile, TileContent, TileAction } from '../../../../components/Tile'

import MeasurementsTable from '../../../../components/Table/Measurements'
import File from '../../../../components/Files/File'

import api from '../../../../api'
import { recordToSend, noop, buildShareLink } from '../../../../util'
import MedicationsTable from '../../../../components/Table/Medications'
import Button from '../../../../components/Button'
import Template from '../../../../components/Template'
import MediaQuery from '../../../../components/MediaQuery'
import CardFooter from '../../../../components/Card/CardFooter'
import Tooltip from '../../../../components/Tooltip'
import RecordDownload from './RecordDownload'
import CommentsList from '../CommentsList'

import '../Comments.css'
import withUser from '../../../../redux/util/withUser'
import Modal from '../../../../components/Modal'

import { RecordEdit } from '../Form/RecordForm'
import commonIntlMessages from '../../../../i18n/common-messages'

const intlMessages = defineMessages({
  getRecordLink: {
    id: 'record.get_link',
    description: 'Текст для тултипа "Получить ссылку на запись"',
    defaultMessage: 'Получить ссылку на запись'
  },
  downloadRecord: {
    id: 'record.download',
    description: 'Текст для тултипа "Скачать запись"',
    defaultMessage: 'Скачать запись'
  },
  copied: {
    id: 'record.copied',
    description: 'Текст для тултипа "Скопировано"',
    defaultMessage: 'Скопировано'
  }
})

class Record extends Component {
  constructor () {
    super()

    this.state = {
      publishing: false,
      showEdit: false,
      shareLink: ''
    }
  }

  componentDidMount () {
    if (!this.props.sosPath) {
      this.updateShareLink()
    }
  }

  updateShareLink () {
    if (!this.props.shared && (this.props.user && this.props.user.entity_type === 'patient')) {
      api.getRecordShareToken(this.props.cardId, this.props.id)
        .then(({data: {data}}) => {
          this.setState({
            shareLink: buildShareLink(data)
          })
        })
    }
  }

  componentDidUpdate () {
    if (this.props.status !== 'new' && this.copyLinkEl && this.state.shareLink && !this.clip) {
      this.clip = new Clipboard(this.copyLinkEl, {text: () => this.state.shareLink})
      this.clip.on('success', () => {
        this.setState({
          copied: true
        })

        this.updateShareLink()
      })
    }
  }

  componentWillUnmount () {
    if (this.clip) {
      this.clip.destroy()
    }
  }

  removeCard () {
    const { cardId, id, onRemove } = this.props

    this.setState({
      removing: true
    })

    api.deleteCardRecord(cardId, id)
      .then(onRemove)
      .catch((e) => {
        this.setState({
          removing: false
        })
      })
  }

  render () {
    const { props } = this

    const {
      title,
      text,
      section,
      status,
      cardId,
      id,
      recordDate,
      measurements,
      medications,
      author,
      files,
      shared,
      commentsParams,
      canEdit,
      onPublish,
      commentsAllowLoadMore,
      user,
      intl
    } = this.props

    let recordType = 'detailed'

    if (section) {
      if (section.recordPersonalDiary) {
        recordType = 'personal'
      } else if (section.recordDrug) {
        recordType = 'medications'
      }
    }

    const cardClassName = classNames({ 'record-new': status === 'new' })

    let canPublish = !!text || (files && files.length > 0) || (measurements && measurements.length > 0)

    let publishBtn = null

    const deleteBtn = <Button loading={this.state.removing} disabled={this.state.removing} onClick={() => { this.removeCard() }} link size='xs'>{ intl.formatMessage(commonIntlMessages.remove) }</Button>
    const editBtn = <Button onClick={() => { this.setState({ showEdit: true }) }} ghost size='xs' className='ghost'>{ intl.formatMessage(commonIntlMessages.editButton) }</Button>

    if (canPublish) {
      publishBtn = <Button
        disabled={this.state.publishing}
        loading={this.state.publishing}
        onClick={() => {
          this.setState({publishing: true})
          const req = api.publishCardRecord(cardId, id, recordToSend(props))
            .then(onPublish)
            .catch(onPublish)

          req.then(() => {
            this.setState({publishing: false})
          })
        }}
        size='xs'
      >
        { intl.formatMessage(commonIntlMessages.publish) }
      </Button>
    }

    let authorUrl = null

    if (author.id === user.id) {
      authorUrl = '/cabinet/profile'
    } else if (user.entity_type === 'patient' && author.entity_type === 'doctor') {
      authorUrl = `/cabinet/doctors/${author.id}`
    } else if (author.entity_type === 'patient') {
      authorUrl = `/cabinet/patients/${author.id}`
    }

    if (author.entity_type === 'doctor' && user.entity_type === 'doctor') {
      authorUrl = ''
    }

    return <div className='record-container'>
      <Card className={cardClassName}>
        <Template if={status === 'new' && !shared}>
          <Tile centered className='record-controls'>
            <TileContent>
              <i>{ intl.formatMessage(commonIntlMessages.recordDraftStatus) }</i>
            </TileContent>
            <MediaQuery rule='(min-width: 656px)'>
              <TileAction>
                <Template if={canEdit}>
                  { deleteBtn }
                  { editBtn }
                  { publishBtn }
                </Template>
              </TileAction>
            </MediaQuery>
          </Tile>
        </Template>

        <MediaQuery rule='(min-width: 656px)'>
          <CardHeader>
            <Tile centered>
              <TileContent>
                <UserIdentity
                  sosPath={props.sosPath}
                  user={author}
                  size={'sm'}
                  url={shared ? '#' : authorUrl}
                /> <span className='record-section-path'><FeatherIcon icon='chevron-right' size={20} /> { section.name }</span>
              </TileContent>
              <TileAction>
                <time className='date'><FormattedDate value={recordDate} /> { intl.formatMessage(commonIntlMessages.prepositionAt) } <FormattedTime value={recordDate} /></time>

                <Template if={status !== 'new' && !shared && !props.sosPath}>
                  {
                    (user && user.entity_type === 'patient')
                      ? <Tooltip text={!this.state.copied ? intl.formatMessage(intlMessages.getRecordLink) : intl.formatMessage(intlMessages.copied)}>
                        <span
                          className='record-action'
                          onMouseLeave={() => {
                            this.setState({
                              copied: false
                            })
                          }}
                        >
                          <Button
                            size='xs'
                            link
                            loading={!this.state.shareLink}
                          >
                            <span ref={(node) => { this.copyLinkEl = node }}>
                              <FeatherIcon icon='link' size={15} />
                            </span>
                          </Button>
                        </span>
                      </Tooltip>
                      : null
                  }

                  <Tooltip text={intl.formatMessage(intlMessages.downloadRecord)}>
                    <span className='record-action'><RecordDownload cardId={cardId} recordId={id} /></span>
                  </Tooltip>
                </Template>
              </TileAction>
            </Tile>
          </CardHeader>
        </MediaQuery>

        <MediaQuery rule='(max-width: 655px)'>
          <CardHeader className={classNames({'with-record-controls': status !== 'new' && !shared && !props.sosPath})}>
            <Template if={status !== 'new' && !shared && !props.sosPath}>
              <div className='record-actions'>
                {
                  (user && user.entity_type === 'patient')
                    ? <Tooltip text={!this.state.copied ? 'Получить ссылку на запись' : 'Скопировано'}>
                      <span
                        className='record-action'
                        onMouseLeave={() => {
                          this.setState({
                            copied: false
                          })
                        }}
                      >
                        <Button
                          size='xs'
                          link
                          loading={!this.state.shareLink}
                        >
                          <span ref={(node) => { this.copyLinkEl = node }}>
                            <FeatherIcon icon='link' size={15} />
                          </span>
                        </Button>
                          Поделиться
                      </span>
                    </Tooltip>
                    : null
                }

                <Tooltip text='Скачать запись'>
                  <span className='record-action'><RecordDownload cardId={cardId} recordId={id} />Сохранить</span>
                </Tooltip>
              </div>
            </Template>
            <UserIdentity
              centred={false}
              user={author}
              size={'sm'}
              className='card-user-identity--mobile'
              subtitle={<div><time className='date'><FormattedDate value={recordDate} /> {intl.formatMessage(commonIntlMessages.prepositionAt)} <FormattedTime value={recordDate} /></time></div>}
            />
          </CardHeader>
        </MediaQuery>

        <CardBody>
          <MediaQuery rule='(max-width: 655px)'>
            <div className='record-section-path'>{ section.name }</div>
          </MediaQuery>

          <div className='record-body'>
            <h3 className='record-title'>
              {
                props.sosPath
                  ? title
                  : <Link to={`/cabinet/cards/${cardId}/records/${id}`}>{ title }</Link>
              }
            </h3>
            { text && <div className='record-text'>{ text }</div> }

            {
              measurements && measurements.length
                ? <MeasurementsTable items={measurements} />
                : null
            }

            {
              medications && medications.length
                ? <MedicationsTable items={medications} />
                : null
            }

            {
              files && files.length
                ? <div className='record-files-collection files-grid'>
                  { files.map((f) => <div key={f.id}><File title={f.title} size={f.fileSize} type={f.fileType} url={f.url} /></div>) }
                </div>
                : null
            }
          </div>
        </CardBody>

        <Template if={status === 'new'}>
          <MediaQuery rule='(max-width: 655px)'>
            <CardFooter className='card-footer--record-controls'>
              <div className='record-controls--mobile'>
                <div className='columns'>
                  <div className='column col-6'>
                    { publishBtn }
                  </div>
                  <div className='column col-6'>
                    { editBtn }
                  </div>
                </div>

                <div className='columns'>
                  <div className='column col-6 col-mx-auto'>
                    { deleteBtn }
                  </div>
                </div>
              </div>
            </CardFooter>
          </MediaQuery>
        </Template>
      </Card>

      {
        !shared && !props.sosPath
          ? <div className='record-comments'>
            <CommentsList
              allowLoadMore={commentsAllowLoadMore}
              params={commentsParams}
              cardId={cardId}
              recordId={id}
            />
          </div>
          : null
      }

      {
        this.state.showEdit
          ? <Modal
            onRequestClose={() => {
              this.setState({
                showEdit: false
              })
            }}
          >
            <RecordEdit
              recordType={recordType}
              recordId={id}
              cardId={cardId}
              recordData={this.props}
              onSuccess={() => {
                this.setState({
                  showEdit: false
                })

                this.props.history.push(`/cabinet/cards/${cardId}/records/${id}`)
              }}
            />
          </Modal>
          : null
      }
    </div>
  }
}

Record.propTypes = {
  onPublish: PropTypes.func,
  onRemove: PropTypes.func,
  canEdit: PropTypes.bool,
  commentsParams: PropTypes.object,
  commentsAllowLoadMore: PropTypes.bool,
  shared: PropTypes.bool
}

Record.defaultProps = {
  onPublish: noop,
  onRemove: noop,
  canEdit: false,
  commentsParams: { limit: 1 },
  commentsAllowLoadMore: false,
  shared: false
}

export default injectIntl(withRouter(withUser(Record)))
