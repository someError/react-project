import React, { Component } from 'react'
import { injectIntl, defineMessages } from 'react-intl'

import { Avatar } from '../../../../components/Avatar'
import Textarea from 'react-textarea-autosize'
import { Tile, TileContent, TileIcon } from '../../../../components/Tile'
import { noop } from '../../../../util'

import './CommentForm.css'
import api from '../../../../api'

const intlMessages = defineMessages({
  addCommentLabel: {
    id: 'label.add_comment',
    description: 'Текст лейбла "добавить комментарий"',
    defaultMessage: 'Добавить коментарий'
  }
})

class CommentForm extends Component {
  constructor () {
    super()

    this.state = {
      text: '',
      sending: false
    }

    this.submit = this.submit.bind(this)
  }

  submit (e) {
    e.preventDefault()

    if (this.state.sending) {
      return
    }

    this.setState({
      sending: true
    })
    this.postReq = api.postCardRecordComment(this.props.cardId, this.props.recordId, this.state.text)

    this.postReq.then(({ data: { data } }) => {
      this.setState({
        text: '',
        sending: false
      })
      this.props.onSuccess(data)
    })
  }

  render () {
    const { user, intl } = this.props

    return <form>
      <Tile>
        <TileIcon>
          <Avatar
            size='sm'
            src={user.avatar && user.avatar.url}
            initial={`${user.firstName[0]}${user.lastName[0]}`}
          />
        </TileIcon>
        <TileContent>
          <Textarea
            value={this.state.text}
            onChange={(e) => {
              this.setState({
                text: e.target.value
              })
            }}
            onKeyPress={(e) => {
              if (e.which === 13 && !e.shiftKey) {
                e.preventDefault()
                if (this.state.text.trim()) {
                  this.submit(e)
                }
              }
            }}
            placeholder={intl.formatMessage(intlMessages.addCommentLabel)}
            className='comment-textarea'
            minRows={1}
            maxRows={3}
          />
        </TileContent>
      </Tile>
    </form>
  }
}

CommentForm.defaultProps = {
  onSuccess: noop
}

export default injectIntl(CommentForm)
