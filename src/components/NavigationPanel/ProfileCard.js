import React from 'react'
import { Link } from 'react-router-dom'

import Avatar from '../Avatar'

import './ProfileCard.css'

const ProfileCard = ({ avatar, fullName, firstName, lastName }) => {
  return <div className='text-center nav-panel-profile'>
    <Avatar
      src={avatar && avatar.url}
      initial={`${firstName.split('')[0]}${lastName.split('')[0]}`}
      alt={`${fullName}`}
      size='xl'
    />

    <div className='nav-panel-profile__name'>{ fullName }</div>
    <div><Link to='/cabinet/logout'>выйти</Link></div>
  </div>
}

export default ProfileCard
