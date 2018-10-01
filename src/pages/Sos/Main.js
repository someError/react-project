import React, { Component } from 'react'
import { connect } from 'react-redux'
import { injectIntl, defineMessages } from 'react-intl'
import { Avatar } from '../../components/Avatar'
import api from '../../api'
import moment from 'moment-timezone'
import Template from '../../components/Template'
import { Tile, TileIcon, TileContent } from '../../components/Tile'
import Button from '../../components/Button'

import './style.css'
import OverlaySpinner from '../../components/Loader/OverlaySpinner'
import { Card, CardBody } from '../../components/Card'

import commonIntlMessages from '../../i18n/common-messages'

const intlMessages = defineMessages({
  summaryTitle: {
    id: 'sos.summary_title',
    defaultMessage: 'Общая информация'
  },
  openCardBtn: {
    id: 'sos.open_card',
    defaultMessage: 'Открыть карту'
  },
  contactsTitle: {
    id: 'sos.contacts_card',
    defaultMessage: 'Контакты для связи'
  },
  visitedDoctors: {
    id: 'sos.visited_doctors',
    defaultMessage: 'Список врачей, у которых пациент был на приеме'
  }
})

class Sos extends Component {
  constructor () {
    super()
    this.state = {
      loading: true
    }
    this.onChange = this.onChange.bind(this)
  }

  onChange (e) {
    if (this.state[e.target.name]) {
      this.setState({[e.target.name]: false})
    } else {
      this.setState({[e.target.name]: true})
    }
    // const public =  Object.keys(this.state).map((key, val) => {
    //   console.log(key)
    //   console.log(val)
    // })
  }

  componentDidMount () {
    api.getEmergenciesCardPublic()
      .then(({ data: { data } }) => {
        this.setState({...data, loading: false})
      })
  }

  render () {
    const { state, props } = this
    const { match, intl } = props
    if (state.loading) {
      return <OverlaySpinner initial />
    }
    return (
      <Card>
        <CardBody>
          <Tile className='sos-header'>
            <TileIcon>
              {/* <Avatar */}
              {/* size='2xl' */}
              {/* src={user.avatar && user.avatar.url} */}
              {/* /> */}
              <TileContent>
                { state.name && <h2>{ state.name }</h2> }
                { state.birthday && <div className='color-gray'>{moment(state.birthday).format('YYYY')} года рождения</div> }
              </TileContent>
            </TileIcon>
            {/* <TileContent> */}
            {/* { state.name && <h2>{ state.name }</h2> } */}
            {/* { state.birthday && <div className='color-gray'>{moment(state.birthday).format('YYYY')} года рождения</div> } */}
            {/* </TileContent> */}
          </Tile>
          <div>
            <div className='l-sos__section-title'>{intl.formatMessage(intlMessages.summaryTitle)}</div>
            <section>
              <div className='form-grid'>
                <div className='columns'>
                  <div className='column col-6 color-gray'>{intl.formatMessage(commonIntlMessages.labelContraindications)}</div>
                  <div className='column col-6'>{ state.contraindications || '-' }</div>
                </div>
                <div className='columns'>
                  <div className='column col-6 color-gray'>{intl.formatMessage(commonIntlMessages.labelChronic)}</div>
                  <div className='column col-6'>{ state.chronicDiseases || '-' }</div>
                </div>
                <div className='columns'>
                  <div className='column col-6 color-gray'>{intl.formatMessage(commonIntlMessages.labelDiseases)}</div>
                  <div className='column col-6'>
                    {
                      state.diseases && state.diseases.length
                        ? state.diseases.map((diseas) => {
                          return diseas.name
                        }).join(', ')
                        : '-'
                    }
                  </div>
                </div>
                <div className='columns'>
                  <div className='column col-6 color-gray'>{intl.formatMessage(commonIntlMessages.labelDrugs)}</div>
                  <div className='column col-6'>
                    {
                      state.drugs && state.drugs.length
                        ? state.drugs.map((drug) => {
                          return drug.name
                        }).join(', ')
                        : '-'
                    }
                  </div>
                </div>

                <div className='columns'>
                  <div className='column col-6 color-gray'>{intl.formatMessage(commonIntlMessages.labelBloodRhesus)}</div>
                  <div className='column col-6'>{ (state.blood && state.blood.name) || '-' }</div>
                </div>
              </div>
            </section>

            <section>
              <div className='l-sos__section-title'>
                { intl.formatMessage(commonIntlMessages.medicalCardTitle) }
                <Button
                  size='sm'
                  style={{marginLeft: '1.25rem'}}
                  to={`${match.url}/medical`}
                >
                  { intl.formatMessage(intlMessages.openCardBtn) }
                </Button>
              </div>
            </section>

            {
              state.contacts && state.contacts.length
                ? (
                  <Template>
                    <div className='l-sos__section-title'>{ intl.formatMessage(intlMessages.contactsTitle) }</div>
                    <section>
                      <div className='sos-contacts'>
                        <div className='sos-contacts__row sos-contacts__row--header'>
                          <div className='sos-contacts__td'>{ intl.formatMessage(commonIntlMessages.phone) }</div>
                          <div className='sos-contacts__td' />
                          <div className='sos-contacts__td'>{ intl.formatMessage(commonIntlMessages.firstName) }</div>
                          <div className='sos-contacts__td'>{ intl.formatMessage(commonIntlMessages.labelDescription) }</div>
                        </div>
                        {
                          state.contacts.map((contact, i) => {
                            return (
                              <div key={`sos-contact-${i}`} className='sos-contacts__row'>
                                <div className='sos-contacts__td' style={{fontWeight: 500}}>
                                  <a href={`tel:${contact.phone.replace(/\s+/g, '')}`}>{ contact.phone }</a>
                                </div>
                                <div className='sos-contacts__td' />
                                <div className='sos-contacts__td'>{ contact.name }</div>
                                <div className='sos-contacts__td'>{ contact.description }</div>
                              </div>
                            )
                          })
                        }
                      </div>
                    </section>
                  </Template>
                )
                : null
            }

            {
              state.doctors && state.doctors.length
                ? (
                  <Template>
                    <div className='l-sos__section-title'>{ intl.formatMessage(intlMessages.visitedDoctors) }</div>
                    <section>
                      {
                        state.doctors.map(doctor => {
                          return (
                            <Tile className='l-sos__doctor'>
                              <TileIcon>
                                <Avatar
                                  size='xl'
                                  initial={`${doctor.firstName[0]}${doctor.lastName[0]}`}
                                  src={doctor.avatar && doctor.avatar.url}
                                />
                              </TileIcon>
                              <TileContent>
                                <div className='l-sos__doctor-content'>
                                  <div className='doctor-name'>
                                    { doctor.lastName } { doctor.firstName } { doctor.middleName}
                                  </div>
                                  <div className='doctor-specialties'>
                                    {
                                      doctor.specialties.map((specialty, i) => {
                                        console.log(specialty)
                                        let str = specialty.name
                                        if (doctor.specialties.length > (i + 1)) {
                                          str += ', '
                                        }
                                        return str
                                      })
                                    }
                                  </div>
                                </div>
                                {
                                  doctor.publicPhone && <a href={`tel:${doctor.publicPhone.replace(/\s+/g, '')}`}>
                                    { doctor.publicPhone}
                                  </a>
                                }
                              </TileContent>
                            </Tile>
                          )
                        })
                      }
                    </section>
                  </Template>
                )
                : null
            }

          </div>
        </CardBody>
      </Card>
    )
  }
}

const mapStateToProps = ({ user, reference }) => {
  return {
    user,
    reference
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Sos))
