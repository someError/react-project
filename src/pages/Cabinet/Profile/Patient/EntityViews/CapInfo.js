import React from 'react'
import CapCard from '../../../../../components/CapCard'
import Button from '../../../../../components/Button'
import './CapInfo.css'
import { FormattedMessage } from 'react-intl'

const CapInfo = (props) => {
  return (
    <div className='l-cap-info'>
      <div className='l-cap-info__top'>
        <div className='l-cap-info__top-text'>
          <h2>
            <FormattedMessage
              id='cap.title'
              defaultMessage='Карта экстренной помощи (КЭП)'
            />
          </h2>
          <p>
            <FormattedMessage
              id='cap.about_text'
              defaultMessage='Онтологический статус искусства многопланово иллюстрирует композиционный стиль. Идея (пафос) трансформирует холерик, так Г.Корф формулирует собственную антитезу. Апперцепция изящно трансформирует персональный импрессионизм.'
            />
          </p>
          <Button
            onClick={props.onSubmit}
          >
            <FormattedMessage
              id='cap.order_card'
              defaultMessage='Заказать карту'
            />
          </Button>
        </div>
        <CapCard name={`${props.lastName} ${props.firstName}`} />
      </div>
      <div className='l-cap-info__row'>
        <h4>
          <FormattedMessage
            id='cap.for_whom'
            defaultMessage='Для кого'
          />
        </h4>
        <p>
          <FormattedMessage
            id='cap.for_whom_text'
            defaultMessage='Онтологический статус искусства многопланово иллюстрирует композиционный стиль. Идея (пафос) трансформирует холерик, так Г.Корф формулирует собственную антитезу. Апперцепция изящно трансформирует персональный импрессионизм. Художественный талант, согласно традиционным представлениям, органичен.'
          />
        </p>
      </div>
      <div className='l-cap-info__row'>
        <h4>
          <FormattedMessage
            id='cap.for_what'
            defaultMessage='Для чего'
          />
        </h4>
        <p><FormattedMessage
          id='cap.for_whom_text'
          defaultMessage='Онтологический статус искусства многопланово иллюстрирует композиционный стиль. Идея (пафос) трансформирует холерик, так Г.Корф формулирует собственную антитезу. Апперцепция изящно трансформирует персональный импрессионизм. Художественный талант, согласно традиционным представлениям, органичен.'
        /></p>
      </div>
      <div className='l-cap-info__row'>
        <h4>
          <FormattedMessage
            id='cap.how_to_get'
            defaultMessage='Как получить'
          />
        </h4>
        <p><FormattedMessage
          id='cap.for_whom_text'
          defaultMessage='Онтологический статус искусства многопланово иллюстрирует композиционный стиль. Идея (пафос) трансформирует холерик, так Г.Корф формулирует собственную антитезу. Апперцепция изящно трансформирует персональный импрессионизм. Художественный талант, согласно традиционным представлениям, органичен.'
        /></p>
      </div>
    </div>
  )
}

export default CapInfo
