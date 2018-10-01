import React from 'react'
import capImg from '../../images/static/cap-card.svg'
import logo from '../../images/logo.svg'
import './CapCard.css'
import FeatherIcon from '../Icons/FeatherIcon'
import { transliterate } from '../../util'
import { FormattedMessage } from 'react-intl'

const CapCard = (props) => {
  return (
    <div className='c-cap-card' style={{backgroundImage: `url(${capImg})`}}>
      <div className='c-cap-card__header'>
        <FeatherIcon icon='activity' size={29} color='#fff' />
        <div>
          <FormattedMessage
            id='cap.card_title'
            defaultMessage='Карта экстренной помощи'
          />
        </div>
      </div>
      <div className='c-cap-card__name'>{ transliterate(props.name) }</div>
      {/* <div className='c-cap-card__url'>phr.kz/25616</div> */}
      {/* <img src={code} alt='' className='c-cap-card__code' /> */}

      <div className='c-cap-card__logo'><img src={logo} alt='' /></div>
    </div>
  )
}

export default CapCard
