import React, { Component } from 'react'
import { injectIntl } from 'react-intl'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import ServiceList from '../../../../components/ServiceList'
import classNames from 'classnames'
import MediaQuery from '../../../../components/MediaQuery'
import FeatherIcon from '../../../../components/Icons/FeatherIcon'
import moment from 'moment'

import commonIntlMessages from '../../../../i18n/common-messages'

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
              { props.licenseFile ? <Tab>{ intl.formatMessage(commonIntlMessages.orgLicenseTitle) }</Tab> : null }
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
              props.licenseFile ? (
                <TabPanel>
                  <h2 className='doctor-info__title'>{ intl.formatMessage(commonIntlMessages.orgLicenseTitle) }</h2>
                  { this.renderLicense() }
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
                      Специалиазация
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
            </div>
          </div>
        </MediaQuery>
      </div>
    )
  }

  renderLicense () {
    const { licenseFile, licenseNumber, licenseDate, intl } = this.props

    return (
      <div key={licenseFile.id} className='doctor-info__diplomas'>
        <div className='doctor-info__diplomas-left'>
          <div className='doctor-info__diplomas-img-wrap'><img src={licenseFile.url} className='doctor-info__diplomas-img' /></div>
        </div>
        <div className='doctor-info__diplomas-right'>
          <div className='columns'>
            <div className='column col-5'>
              <div className='doctor-info__diplomas-label'>
                {intl.formatMessage(commonIntlMessages.licenseNumberTitle)}
              </div>
              №: { licenseNumber }
            </div>
            {
              licenseDate && (
                <div className='column col-5'>
                  <div className='doctor-info__diplomas-label'>
                    {intl.formatMessage(commonIntlMessages.licenseYearTitle)}
                  </div>
                  {moment.utc(licenseDate).format('DD.MM.YYYY г.')}
                </div>
              )
            }
          </div>
        </div>
      </div>
    )
  }
}

export default injectIntl(InfoTabs)
