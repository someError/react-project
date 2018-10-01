import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Avatar } from '../../../components/Avatar'
import FeatherIcon from '../../../components/Icons/FeatherIcon'
import { Tile, TileContent, TileIcon, TileAction } from '../../../components/Tile'
import api from '../../../api'
import intlMessages from '../../../i18n/common-messages'
import './Assistant.css'

const Assistant = ({ firstName, lastName, middleName, avatar, organization, intl, ...props }) => {
  return (
    <div className='c-assistant'>
      <Tile>
        <TileIcon>
          <Avatar
            src={avatar ? avatar.url : null}
            initial={firstName.charAt(0) + lastName.charAt(0)}
          />
        </TileIcon>
        <TileContent>
          <h4>{lastName} {firstName} {middleName}</h4>
          {
            organization && <p>{ organization.name }</p>
          }
        </TileContent>
        <TileAction>
          {
            organization ? (
              <span onClick={() => {
                api.unlinkAssistant(props.id)
                  .then(({data: {data}}) => {
                    props.onUnlink(data)
                  })
              }}>
                <FeatherIcon icon='power' size={15} color='#9f9f9f' /> <FormattedMessage id='assistant.unlink' description='Текст ссылки "открепить" у ассистента' defaultMessage='Открепить' />
              </span>
            ) : (
              <span onClick={props.onDelete}><FeatherIcon icon='x' size={15} color='#9f9f9f' /> { intl.formatMessage(intlMessages.remove) }</span>
            )
          }
        </TileAction>
      </Tile>
    </div>
  )
}

export default injectIntl(Assistant)
