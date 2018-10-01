import React, { Component } from 'react'
import { injectIntl } from 'react-intl'

import { Card, CardBody } from '../../../../components/Card'
import { Tile, TileContent, TileIcon } from '../../../../components/Tile'
import { Avatar } from '../../../../components/Avatar'
import FeatherIcon from '../../../../components/Icons/FeatherIcon'

import MediaQuery from '../../../../components/MediaQuery'

import commonIntlMessages from '../../../../i18n/common-messages'

class DetailCard extends Component {
  constructor (props) {
    super(props)

    this.state = {
      showRequestAccessModal: false
    }
  }

  render () {
    const { props } = this
    const { intl } = props

    return <Card className='card--content doctor-detail doctor-detail-card'>
      <CardBody>
        <Tile>
          <TileIcon>
            <Avatar
              size='2xl'
              src={props.avatar ? props.avatar.url : null}
              initial='ЕС'
            />
          </TileIcon>
          <TileContent>
            <div className='doctor-detail__top'>
              <div className='doctor-detail__nav'>
                {
                  props.medicalCardInfo.signCount ? <a href='#'>
                    <FeatherIcon icon='clipboard' size={16} /> { intl.formatMessage(commonIntlMessages.recordsPlural, { count: props.medicalCardInfo.signCount }) }
                  </a> : null
                }
              </div>
            </div>
            <h2 className='doctor-detail__name'>
              { props.name }
              { props.favorite && <FeatherIcon color='#FD5577' icon='heart' size={24} />}
            </h2>
            {
              props.specialties &&
              <div className='doctor-detail__specialties'>
                {
                  props.specialties.map((specialty, i) => {
                    const separator = (i !== 0) ? ', ' : ''
                    return (
                      separator + specialty.name
                    )
                  })
                }
              </div>
            }
            <MediaQuery rule='(min-width: 768px)'>
              <div className='doctor-detail__bot'>
                {
                  props.publicPhone && <span>
                    <a href={`tel:${props.publicPhone}`} className='doctor-detail__phone'>{ props.publicPhone }</a>
                  </span>
                }
                {
                  props.publicEmail && <span>
                    <a href={`mailto:${props.publicEmail}`}>{props.publicEmail}</a>
                  </span>
                }
                {
                  props.region && <span>{ props.region.name }</span>
                }
              </div>
            </MediaQuery>
          </TileContent>
        </Tile>
        <MediaQuery rule='(max-width: 767px)'>
          <div className='doctor-detail__bot'>
            {
              props.publicPhone && <span>
                <a href={`tel:${props.publicPhone}`} className='doctor-detail__phone'>{ props.publicPhone }</a>
              </span>
            }
            {
              props.publicEmail && <span>
                <a href={`mailto:${props.publicEmail}`}>{props.publicEmail}</a>
              </span>
            }
            {
              props.region && <span>{ props.region.name }</span>
            }
          </div>
        </MediaQuery>
      </CardBody>
      {/* <CardFooter> */}
      {/* <Link to='/'>Second Opinion</Link> */}
      {/* <Link to='/'>Дистанционная консультация</Link> */}
      {/* </CardFooter> */}
    </Card>
  }
}

export default injectIntl(DetailCard)
