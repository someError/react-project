import React from 'react'
import { NavLink } from 'react-router-dom'
import FeatherIcon from '../../../components/Icons/FeatherIcon'
import { Tile, TileIcon, TileContent } from '../../../components/Tile'

import './AddNavigation.css'

const AddNavigation = ({ cardId }) => {
  const recordBase = `/cabinet/cards/${cardId}/records/add`

  return <div className='add-nav'>
    Добавить:
    <NavLink className='add-nav__link' to={`${recordBase}/detailed`}>
      <Tile centered>
        <TileIcon><FeatherIcon icon='clipboard' size={22} /></TileIcon>
        <TileContent>запись</TileContent>
      </Tile>
    </NavLink>
    <NavLink className='add-nav__link' to={`${recordBase}/medications`}>
      <Tile centered>
        <TileIcon><FeatherIcon icon='pill' size={22} /></TileIcon>
        <TileContent>приём лекарств</TileContent>
      </Tile>
    </NavLink>
    <NavLink className='add-nav__link' to={`${recordBase}/personal`}>
      <Tile centered>
        <TileIcon><FeatherIcon icon='file-text' size={22} /></TileIcon>
        <TileContent>личный дневник</TileContent>
      </Tile>
    </NavLink>
  </div>
}

AddNavigation.defaultProps = {
  LinkComponent: NavLink
}

export default AddNavigation
