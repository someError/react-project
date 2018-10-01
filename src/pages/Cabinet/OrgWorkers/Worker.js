import React from 'react'
import { injectIntl } from 'react-intl'
import { Avatar } from '../../../components/Avatar'
import FeatherIcon from '../../../components/Icons/FeatherIcon'
import { Tile, TileContent, TileIcon, TileAction } from '../../../components/Tile'
import api from '../../../api'
import { ORG_ROLES } from '../../../util'
import withUser from '../../../redux/util/withUser'

import commonIntlMessages from '../../../i18n/common-messages'

const Worker = ({ firstName, lastName, middleName, avatar, user: { organization }, intl, ...props }) => {
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
          <p>{ ORG_ROLES[props.entity_type] }</p>
        </TileContent>
        <TileAction>
          {
            props.entity_type === 'doctor' ? (
              <span onClick={() => {
                api.unlinkDoctor(props.id, organization.id)
                  .then(({data: {data}}) => {
                    props.onUnlink(data)
                  })
              }}>
                <FeatherIcon icon='power' size={15} color='#9f9f9f' /> { intl.formatMessage(commonIntlMessages.detach) }
              </span>
            ) : (
              <span onClick={() => { props.onDelete(props.entity_type) }}><FeatherIcon icon='x' size={15} color='#9f9f9f' /> { intl.formatMessage(commonIntlMessages.remove) }</span>
            )
          }
        </TileAction>
      </Tile>
    </div>
  )
}

export default injectIntl(withUser(Worker))
