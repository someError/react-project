import React from 'react'
import FeatherIcon from '../Icons/FeatherIcon'
import { Card, CardBody } from '../Card'
import Rating from 'react-rating'
import { RATING_DESCR_LIST } from '../../util'

import './ReviewCard.css'

const ReviewCard = (props) => {
  return (
    <Card className='review-card'>
      <CardBody>
        <div className='review-card__header'>
          <Rating
            className='review-card__rating'
            empty={<FeatherIcon color='#1bbeb5' icon={'star'} size={14} />}
            placeholder={<FeatherIcon color='#1bbeb5' fill='#1bbeb5' icon={'star'} size={14} />}
            full={<FeatherIcon color='#1bbeb5' fill='#1bbeb5' icon={'star'} size={14} />}
            readonly
            initialRate={props.value}
          />
          <span>{RATING_DESCR_LIST[props.value]}</span>
          <div className='review-card__name'>{props.name}</div>
        </div>
        <p className='review-card__text'>
          {props.text}
        </p>
      </CardBody>
    </Card>
  )
}

export default ReviewCard
