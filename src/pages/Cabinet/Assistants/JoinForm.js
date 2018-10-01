import React, {Component} from 'react'
import qs from 'qs'
import classNames from 'classnames'
import { injectIntl, defineMessages } from 'react-intl'
import Modal, { ModalHeader, ModalBody } from '../../../components/Modal'
import { Select } from '../../../components/Form'
import { Avatar } from '../../../components/Avatar'
import FeatherIcon from '../../../components/Icons/FeatherIcon'
import Template from '../../../components/Template'
import { Tile, TileContent, TileIcon } from '../../../components/Tile'
import api from '../../../api'
import withUser from '../../../redux/util/withUser'
import Button from '../../../components/Button'
import { Spinner, OverlaySpinner } from '../../../components/Loader'
import commonIntlMessages from '../../../i18n/common-messages'

const intlMessages = defineMessages({
  chooseOrg: {
    id: 'assistants.choose_org',
    defaultMessage: 'Выберите медорганизацию'
  }
})

class AddForm extends Component {
  constructor () {
    super()
    this.state = {
      organization: '',
      assistants: null,
      assistantsLoading: false,
      assistant: null
    }
    this.onSubmit = this.onSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  onSubmit (e) {
    e.preventDefault()
    this.setState({postLoading: true})
    api.linkAssistant(this.state.assistant)
      .then(({data: {data}}) => {
        this.props.onLink(data)
        this.props.onClose()
      })
  }

  onChange (e) {
    this.setState({
      organization: e.target.value,
      assistantsLoading: true
    })

    api.searchAssistant(qs.stringify({
      limit: 100,
      filter: {
        organization: [
          {
            type: 'eq',
            value: e.target.value
          }
        ]
      }
    })).then(({data: {data}}) => {
      this.setState({
        assistants: data.items,
        assistantsLoading: false
      })
    })
  }

  render () {
    const { state, props } = this
    const { user: { organizations } } = props
    return (
      <Modal
        onRequestClose={props.onClose}
      >
        <ModalHeader>
          <h1>Прикрепить ассистента</h1>
        </ModalHeader>
        <ModalBody>
          <form onSubmit={this.onSubmit} id='addAssistantForm' className='form-grid l-assistant-join'>
            <div className='columns'>
              <div className='column col-12'>
                <Select
                  material
                  label={props.intl.formatMessage(intlMessages.chooseOrg)}
                  value={state.organization}
                  onChange={this.onChange}
                >
                  {
                    organizations && organizations.length
                      ? organizations.map(organization => {
                        return <option value={organization.id} key={organization.id}>{organization.name}</option>
                      }) : null
                  }
                </Select>
              </div>
            </div>
            <div className='spinner-wrap'>
              {
                state.assistants && state.assistants.length
                  ? this.renderAssistentsList()
                  : null
              }
              {
                state.assistantsLoading && (
                  state.assistants && state.assistants.length ? <OverlaySpinner /> : <Spinner />
                )
              }
            </div>
          </form>
        </ModalBody>
      </Modal>
    )
  }

  renderAssistentsList () {
    return (
      <Template>
        {
          this.state.assistants.map(assistant => {
            const disabled = this.props.selfAssistants.indexOf(assistant.id) + 1
            const active = this.state.assistant === assistant.id

            return (
              <div
                key={assistant.id}
                className={classNames({ active, disabled }, 'c-assistant')}
                onClick={() => {
                  if (disabled) return
                  this.setState({assistant: assistant.id})
                }}
              >
                <Tile>
                  <TileIcon>
                    <Avatar
                      src={assistant.avatar ? assistant.avatar.url : null}
                      initial={assistant.firstName.charAt(0) + assistant.lastName.charAt(0)}
                    />
                  </TileIcon>
                  <TileContent>
                    <span className='c-assistant__name'>{assistant.lastName} {assistant.firstName} {assistant.middleName}</span>
                    <FeatherIcon color='#1BBEB5' size={20} icon={'check'} />
                  </TileContent>
                </Tile>
                {
                  this.state.assistant !== assistant.id && <div className='c-assistant__mask' />
                }
              </div>
            )
          })
        }
        <Button
          loading={this.state.postLoading}
          disabled={!this.state.assistant}
          size='sm'
        >
          { this.props.intl.formatMessage(commonIntlMessages.invite) }
        </Button>
      </Template>
    )
  }
}

export default injectIntl(withUser(AddForm))
