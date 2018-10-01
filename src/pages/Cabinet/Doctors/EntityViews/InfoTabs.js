import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { injectIntl } from 'react-intl'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import ServiceList from '../../../../components/ServiceList'
import classNames from 'classnames'
import MediaQuery from '../../../../components/MediaQuery'
import FeatherIcon from '../../../../components/Icons/FeatherIcon'
import Slick from 'react-slick'

import commonIntlMessages from '../../../../i18n/common-messages'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

class InfoTabs extends Component {
  constructor () {
    super()
    this.state = {
      activeIndex: null
    }
  }

  handleClick (i) {
    if (this.state.activeIndex === i) {
      this.setState({activeIndex: null})
    } else {
      this.setState({activeIndex: i})
    }
  }

  render () {
    const { props, state } = this

    const { intl } = props

    return (
      <div>
        <MediaQuery rule='(min-width: 768px)'>
          <Tabs className='doctor-info'>
            <TabList className='doctor-info__tabs'>
              { props.additionalInformation && <Tab>{ intl.formatMessage(commonIntlMessages.doctorInfoTitle) }</Tab> }
              { props.specialties.length ? <Tab>{ intl.formatMessage(commonIntlMessages.doctorSpecialtiesTitle) }</Tab> : null }
              { props.serviceTypes.length ? <Tab>{ intl.formatMessage(commonIntlMessages.doctorServicesTitle) }</Tab> : null }
              { props.organizations.length ? <Tab>{ intl.formatMessage(commonIntlMessages.doctorOrgsTitle) }</Tab> : null }
              { props.diplomas.length ? <Tab>{ intl.formatMessage(commonIntlMessages.doctorDiplomasTitle) }</Tab> : null }
            </TabList>
            {
              props.additionalInformation && <TabPanel>
                <h2 className='doctor-info__title'>{ intl.formatMessage(commonIntlMessages.doctorInfoTitle) }</h2>
                <p>
                  { props.additionalInformation }
                </p>
              </TabPanel>
            }
            {
              props.specialties.length ? (
                <TabPanel>
                  <h2 className='doctor-info__title'>{ intl.formatMessage(commonIntlMessages.doctorSpecialtiesTitle) }</h2>
                  <ServiceList className='columns'>
                    {
                      props.specialties.map(specialty => {
                        return (
                          <li key={specialty.id} className='column col-6'>{ specialty.name }</li>
                        )
                      })
                    }
                  </ServiceList>
                </TabPanel>
              ) : null
            }
            {
              props.serviceTypes.length ? (
                <TabPanel>
                  <h2 className='doctor-info__title'>{ intl.formatMessage(commonIntlMessages.doctorServicesTitle) }</h2>
                  <ServiceList className='columns'>
                    {
                      props.serviceTypes.map(service => {
                        return (
                          <li key={service.id} className='column col-6'>{ service.name }</li>
                        )
                      })
                    }
                  </ServiceList>
                </TabPanel>
              ) : null
            }
            {
              props.organizations.length ? (
                <TabPanel>
                  <h2 className='doctor-info__title'>{ intl.formatMessage(commonIntlMessages.doctorOrgsTitle) }</h2>
                  <div className='columns'>
                    {
                      props.organizations.map(org => {
                        return (
                          <div key={org.id} className='column col-3'>
                            <Link className='doctor-info__org' to={`/cabinet/organizations/${org.id}`}>
                              { org.licenseFile && <img src={org.licenseFile.url} alt={org.name} /> }
                            </Link>
                          </div>
                        )
                      })
                    }
                  </div>
                </TabPanel>
              ) : null
            }
            {
              props.diplomas.length ? (
                <TabPanel>
                  <h2 className='doctor-info__title'>{ intl.formatMessage(commonIntlMessages.doctorDiplomasTitle) }</h2>
                  { this.renderDiplomas() }
                </TabPanel>
              ) : null
            }
          </Tabs>
        </MediaQuery>
        <MediaQuery rule='(max-width: 767px)'>
          <div className='doctor-info'>
            <div className='doctor-info__tabs'>
              {
                props.additionalInformation && (
                  <div className={classNames({'active': state.activeIndex === 0}, 'doctor-info__tabs-item')}>
                    <div onClick={() => this.handleClick(0)} className='doctor-info__tabs-item-title'>
                      { intl.formatMessage(commonIntlMessages.doctorInfoTitle) }
                      <FeatherIcon icon={`chevron-${state.activeIndex === 0 ? 'down' : 'right'}`} />
                    </div>
                    <div className='doctor-info__tabs-item-cont'>
                      <p>
                        { props.additionalInformation }
                      </p>
                    </div>
                  </div>
                )
              }
              {
                props.specialties.length ? (
                  <div className={classNames({'active': state.activeIndex === 1}, 'doctor-info__tabs-item')}>
                    <div onClick={() => this.handleClick(1)} className='doctor-info__tabs-item-title'>
                      { intl.formatMessage(commonIntlMessages.doctorSpecialtiesTitle) }
                      <FeatherIcon icon={`chevron-${state.activeIndex === 1 ? 'down' : 'right'}`} />
                    </div>
                    <div className='doctor-info__tabs-item-cont'>
                      <ServiceList className='columns form-grid'>
                        {
                          props.specialties.map(specialty => {
                            return (
                              <li key={specialty.id} className='column col-6'>{ specialty.name }</li>
                            )
                          })
                        }
                      </ServiceList>
                    </div>
                  </div>
                ) : null
              }
              {
                props.serviceTypes.length ? (
                  <div className={classNames({'active': state.activeIndex === 2}, 'doctor-info__tabs-item')}>
                    <div onClick={() => this.handleClick(2)} className='doctor-info__tabs-item-title'>
                      { intl.formatMessage(commonIntlMessages.doctorServicesTitle) }
                      <FeatherIcon icon={`chevron-${state.activeIndex === 2 ? 'down' : 'right'}`} />
                    </div>
                    <div className='doctor-info__tabs-item-cont'>
                      <ServiceList className='columns form-grid'>
                        {
                          props.serviceTypes.map(service => {
                            return (
                              <li key={service.id} className='column col-6'>{ service.name }</li>
                            )
                          })
                        }
                      </ServiceList>
                    </div>
                  </div>
                ) : null
              }
              {
                props.organizations.length ? (
                  <div className={classNames({'active': state.activeIndex === 3}, 'doctor-info__tabs-item')}>
                    <div onClick={() => this.handleClick(3)} className='doctor-info__tabs-item-title'>
                      { intl.formatMessage(commonIntlMessages.doctorOrgsTitle) }
                      <FeatherIcon icon={`chevron-${state.activeIndex === 3 ? 'down' : 'right'}`} />
                    </div>
                    <div className='doctor-info__tabs-item-cont'>
                      <div className='scroll-wrap'>
                        <div className='doctor-info__orgs'>
                          {
                            props.organizations.map(org => {
                              return (
                                <Link className='doctor-info__org' to={`/cabinet/organizations/${org.id}`}>
                                  { org.licenseFile && <img src={org.licenseFile.url} alt={org.name} /> }
                                </Link>
                              )
                            })
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null
              }
              {
                props.diplomas.length ? (
                  <div className={classNames({'active': state.activeIndex === 4}, 'doctor-info__tabs-item')}>
                    <div onClick={() => this.handleClick(4)} className='doctor-info__tabs-item-title'>
                      { intl.formatMessage(commonIntlMessages.doctorDiplomasTitle) }
                      <FeatherIcon icon={`chevron-${state.activeIndex === 4 ? 'down' : 'right'}`} />
                    </div>
                    <div className='doctor-info__tabs-item-cont'>
                      { this.renderDiplomas() }
                    </div>
                  </div>
                ) : null
              }
            </div>
          </div>
        </MediaQuery>
      </div>
    )
  }

  renderDiplomas () {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      vertical: true,
      fade: true
    }
    const { diplomas, intl } = this.props

    return (
      diplomas.map(diploma => {
        const _file = diploma.files && diploma.files[0]
        return (
          <div key={diploma.id} className='doctor-info__diplomas'>
            <div className='doctor-info__diplomas-left'>
              {
                diploma.files && diploma.files.length && diploma.files.length > 1
                  ? (
                    <Slick {...settings} >
                      {
                        diploma.files.map(file => {
                          return <div className='doctor-info__diplomas-img-wrap'><img className='doctor-info__diplomas-img' src={file.url} /></div>
                        })
                      }
                    </Slick>
                  )
                  : (
                    <div className='doctor-info__diplomas-img-wrap'><img src={_file.url} className='doctor-info__diplomas-img' /></div>
                  )
              }
            </div>
            <div className='doctor-info__diplomas-right'>
              <div className='columns'>
                <div className='column col-5'>
                  <div className='doctor-info__diplomas-label'>
                    {intl.formatMessage(commonIntlMessages.diplomaNumberTitle)}
                  </div>
                  №: { diploma.number }
                </div>
                <div className='column col-5'>
                  <div className='doctor-info__diplomas-label'>
                    {intl.formatMessage(commonIntlMessages.diplomaYearTitle)}
                  </div>
                  { diploma.year } г.
                </div>
                {
                  diploma.educationalInstitution && (
                    <div className='column col-12'>
                      <div className='doctor-info__diplomas-label'>
                        {intl.formatMessage(commonIntlMessages.diplomaSchoolTitle)}
                      </div>
                      { diploma.educationalInstitution }
                    </div>
                  )
                }
                {
                  diploma.description && (
                    <div className='column col-12'>
                      <div className='doctor-info__diplomas-label'>
                        {intl.formatMessage(commonIntlMessages.diplomaDescriptionTitle)}
                      </div>
                      <div>{ diploma.description }</div>
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        )
      })
    )
  }
}

export default injectIntl(InfoTabs)
