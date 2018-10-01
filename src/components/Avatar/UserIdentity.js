import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { Tile, TileIcon, TileContent } from '../Tile'
import Avatar from './Avatar'

import './UserIdentity.css'
import NavLink from 'react-router-dom/es/NavLink'

const UserIdentity = ({ user, size, avatarPosition, subtitle, centred, className, url, ...props }) => {
  const tileIcon = <TileIcon>
    <Avatar src={user.avatar && user.avatar.url} size={size} initial={`${(user.firstName || ' ')[0]}${(user.lastName || ' ')[0]}`} />
  </TileIcon>

  return <Tile centered={centred} inline className={classNames('user-identity', className, { [`user-identity--${size}`]: !!size })}>
    { avatarPosition === 'left' && tileIcon }

    <TileContent>
      {
        user.entity_type !== 'assistant' && !props.sosPath && url !== ''
          ? <NavLink to={url || '/cabinet/profile'} className='user-identity__name'>{`${user.firstName || ''} ${user.lastName || ''}`}</NavLink>
          : <span className='user-identity__name'>{`${user.firstName || ''} ${user.lastName || ''}`}</span>
      }
      { subtitle }
    </TileContent>

    { avatarPosition === 'right' && tileIcon }
  </Tile>
}

UserIdentity.defaultProps = {
  size: null,
  avatarPosition: 'left',
  subtitle: null,
  centred: true
}

UserIdentity.propTypes = {
  avatarPosition: PropTypes.oneOf(['left', 'right']),
  subtitle: PropTypes.node,
  centred: PropTypes.bool
}

export default UserIdentity
