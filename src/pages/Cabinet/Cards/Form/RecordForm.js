import React, { Component } from 'react'
import cloneDeep from 'lodash/cloneDeep'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import moment from 'moment'
import { connect } from 'react-redux'
import linkState from 'linkstate'
import { withRouter } from 'react-router'
import { injectIntl, defineMessages } from 'react-intl'

import { Spinner } from '../../../../components/Loader'
import Template from '../../../../components/Template'
import ForRoles from '../../../../components/ForRoles'

import { Tile, TileContent, TileAction, TileIcon } from '../../../../components/Tile'
import { MaterialInput, Select, ErrorMessage } from '../../../../components/Form'
import MediaQuery from '../../../../components/MediaQuery'

import { recordToSend, recordToEdit, errorsToObj, noop } from '../../../../util'
import FeatherIcon from '../../../../components/Icons/FeatherIcon'

import Files from './Files'
import ParametersForm from './ParametersForm'
import DicomFiles from './DicomFiles'
import MedicationsForm from './MedicationsForm'

import './RecordAdd.css'

import api from '../../../../api'
import Button from '../../../../components/Button'
import CardFooter from '../../../../components/Card/CardFooter'
import DateTimeInput from '../../../../components/Form/DateTimeInput'
import Badge from '../../../../components/Badge'
import { withPatientParams } from '../../../../components/PatientProvider/PatientParamsProvider'

import commonIntlMessages from '../../../../i18n/common-messages'

const intlMessages = defineMessages({
  accessStandard: {
    id: 'record.access.standard',
    description: 'название доступа к записи "стандартный"',
    defaultMessage: 'Стандартный'
  },
  accessPrivate: {
    id: 'record.access.private',
    description: 'название доступа к записи "Личный"',
    defaultMessage: 'Личный'
  },
  accessEmergency: {
    id: 'record.access.emergency',
    description: 'название доступа к записи "Экстренный"',
    defaultMessage: 'Экстренный'
  },
  labelTitle: {
    id: 'record.form.label.title',
    defaultMessage: 'Введите название записи'
  },
  addFilesTab: {
    id: 'record.form.tab.files',
    defaultMessage: 'Добавить файлы или изображения'
  },
  addParametersTab: {
    id: 'record.form.tab.params',
    defaultMessage: 'Добавить таблицу'
  },
  addDicomTab: {
    id: 'record.form.tab.docom',
    defaultMessage: 'Добавить ссылку на DICOM файл'
  }
})

const PARAM_SCHEME = {
  parameter: '',
  parameterName: '',
  units: [],
  unit: {},
  normalValueFrom: '',
  normalValueTo: '',
  value: '',
  comment: ''
}

const DRUG_SCHEME = {
  drug: {
    id: '',
    name: ''
  },
  value: '',
  type: 'pill',
  comment: ''
}

const RECORD_SCHEME = {
  section: {},
  title: '',
  text: '',
  status: 'new',
  recordDate: moment().format(),
  accessType: 'standard',
  medications: [],
  measurements: [],
  dicomFiles: [],
  files: []
}

class RecordEditComponent extends Component {
  constructor () {
    super()

    this.state = {
      loading: true
    }
  }

  componentDidMount () {
    this.req = api.getCardRecord(this.props.cardId, this.props.recordId)

    this.req.then(({ data: { data } }) => {
      this.setState({
        loading: false,
        ...data
      })
    })
  }

  componentWillUnmount () {
    if (this.req) {
      this.req.cancel()
    }
  }

  render () {
    const { cardId, parameters, recordId, onSuccess } = this.props

    if (this.state.loading) {
      return <div><br /><br /><Spinner /><br /><br /></div>
    }

    const { section } = this.state

    const recordData = recordToEdit(this.state, parameters || [])

    let recordType = 'detailed'

    if (section.recordPersonalDiary) {
      recordType = 'personal'
    } else if (section.recordDrug) {
      recordType = 'medications'
    }

    return <RecordForm
      method='put'
      recordType={recordType}
      recordId={recordId}
      cardId={cardId}
      recordData={recordData}
      onSuccess={onSuccess}
      patientParams={this.props.patientParams}
    />
  }
}

const mapStateToProps = ({ reference, user }) => {
  return {
    user,
    sections: reference.sections || [],
    parameters: reference.parameters || []
  }
}

const RecordEdit = withPatientParams(connect(mapStateToProps)(RecordEditComponent))

export { RecordEdit }

class RecordFormBase extends Component {
  constructor ({ section, sections, recordData, recordType }) {
    super()

    // const section = sections.find((s) => s.recordDrug)

    if (!recordData) {
      this.state = {
        ...RECORD_SCHEME
      }

      if (recordType === 'medications') {
        this.state = {
          ...this.state,
          medications: [{
            ...DRUG_SCHEME
          }]
        }
      }

      if (recordType === 'personal') {
        this.state = {
          ...this.state,
          measurements: [{
            ...PARAM_SCHEME
          }]
        }
      }
    } else {
      this.state = {
        ...recordData
      }
    }

    if (section) {
      this.state.section = section
    } else if (sections && sections.length === 1) {
      this.state.section = sections[0]
    }

    this.paramChanged = this.paramChanged.bind(this)
  }

  post (status) {
    const { cardId, recordId, method, onSuccess } = this.props

    const data = {
      ...recordToSend(this.state)
    }

    data.record.status = status

    if (method === 'post') {
      this.req = api.postCardRecord(cardId, data)
    } else {
      this.req = api.putCardRecord(cardId, recordId, data)
    }

    this.setState({
      loading: status
    })

    this.req
      .then(({ data: { data } }) => {
        onSuccess(data)

        this.setState({
          loading: false
        })
      })
      .catch((err) => {
        this.setState({
          loading: false
        })

        if (err.response) {
          if (err.response.status === 400) {
            this.setState({
              errors: errorsToObj(err.response.data.data.errors).record
            })
          } else if (err.response.status === 403) {
            this.setState({
              errors: {
                global: err.response.data.data.message
              }
            })
          }
        }
      })

    return this.req
  }

  paramChanged (i, param) {
    const { state } = this
    const measurements = cloneDeep(state.measurements)
    const { patientParams } = this.props

    measurements[i].parameter = param
    measurements[i].parameterName = param.name
    measurements[i].units = param.units
    measurements[i].unit = param.units[0]

    if (patientParams && patientParams.length) {
      const patientParam = patientParams.find((p) => p.parameter.id === param.id)
      if (patientParam) {
        measurements[i].unit = patientParam.unit
        measurements[i].normalValueFrom = patientParam.normalValueFrom || ''
        measurements[i].normalValueTo = patientParam.normalValueTo || ''
      }
    }

    this.setState({
      measurements
    })
  }

  render () {
    const { recordType, sections, intl } = this.props
    const { state } = this

    const { section, measurements, medications, dicomFiles, files, errors, recordDate } = state

    const buttons = <Template>
      <Button disabled={!!state.loading} loading={state.loading === 'new'} onClick={() => { this.post('new') }} type='button' link size='sm'>{ intl.formatMessage(commonIntlMessages.saveAsDraftBtn) }</Button>
      <ForRoles role={['doctor']}>
        <Button disabled={!!state.loading} loading={state.loading === 'sign'} onClick={() => { this.post('sign') }} type='button' size='sm'>{ intl.formatMessage(commonIntlMessages.publish) }</Button>
      </ForRoles>
    </Template>

    const accessSelect = <Template>
      Доступ:{' '}
      <Select
        onChange={linkState(this, 'accessType')}
        className='color-blue'
      >
        <option value='standard'>{ intl.formatMessage(intlMessages.accessStandard) }</option>
        <option value='private'>{ intl.formatMessage(intlMessages.accessPrivate) }</option>
        <option value='emergency'>{ intl.formatMessage(intlMessages.accessEmergency) }</option>
      </Select>
    </Template>

    return <form className='add-form-content'>
      <MediaQuery rule='(min-width: 656px)'>
        <div className='add-form-section' style={{ borderBottom: 'solid 1px #D1D1D1' }}>
          <Tile className='add-form-subs' centered>
            <TileContent>
              { accessSelect }
            </TileContent>
            <TileAction>
              { buttons }
            </TileAction>
          </Tile>
          { errors && errors.global && <ErrorMessage>{ errors.global }</ErrorMessage> }
        </div>
      </MediaQuery>

      <div className='add-form-section'>
        <Tile className='add-form-subs record-add__status-date' centered>
          <TileContent className='text-sm color-gray'>
            { intl.formatMessage(commonIntlMessages.labelSection) }:{' '}
            {
              sections.length > 1
                ? (
                  <Select
                    className={`color-${section.id ? 'blue' : 'red'}`}
                    value={state.section.id}
                    onChange={(e) => { this.setState({section: sections.find((s) => s.id === e.target.value) || {}}) }}
                  >
                    <option value={''}>{ intl.formatMessage(commonIntlMessages.optionNotChosen) }</option>
                    {
                      (sections || [])
                        .map((section) => <option key={section.id} value={section.id}>{section.name}</option>)
                    }
                  </Select>
                )
                : <span className='color-blue'>{ section.name }</span>
            }
            { errors && errors.section && <ErrorMessage>{ errors.section }</ErrorMessage> }
          </TileContent>
          <TileAction>
            <span className='text-sm color-gray'>
              { intl.formatMessage(commonIntlMessages.labelDate) }:
            </span>{' '}
            <span>
              <DateTimeInput
                hideLabels
                onChange={(date) => { this.setState({ recordDate: moment(date).format() }) }}
                value={moment(recordDate).toDate()}
              />
            </span>
          </TileAction>
        </Tile>

        <div className='form-grid'>
          <div className='columns'>
            <div className='column col-12'>
              <MaterialInput
                autoFocus
                error={!!(errors && errors.title)}
                label={intl.formatMessage(intlMessages.labelTitle)}
                value={state.title}
                onChange={linkState(this, 'title')}
                size='lg'
              />
              <ErrorMessage>{ errors && errors.title }</ErrorMessage>
            </div>
          </div>

          <div className='columns'>
            <div className='column col-12'>
              <MaterialInput
                value={state.text}
                error={!!(errors && errors.text)}
                onChange={linkState(this, 'text')}
                textarea
                minRows={4}
                maxRows={15}
              />
              <ErrorMessage>{ errors && errors.text }</ErrorMessage>
            </div>
          </div>
        </div>

        <Template if={recordType === 'detailed'}>
          <Tabs defaultIndex={-1}>
            <TabList className='react-tabs__tab-list attachments__tab-list'>
              <Tab className='react-tabs__tab attachments__tab'>
                <Tile centered><TileIcon><FeatherIcon icon={'file'} /></TileIcon><TileContent><Badge inline value={(files && files.length > 0 && files.length) || null}><span>{ intl.formatMessage(intlMessages.addFilesTab) }</span></Badge></TileContent></Tile>
              </Tab>
              <Tab className='react-tabs__tab attachments__tab'>
                <Tile centered><TileIcon><FeatherIcon icon={'layout'} /></TileIcon><TileContent>{ intl.formatMessage(intlMessages.addParametersTab) }</TileContent></Tile>
              </Tab>
              <Tab className='react-tabs__tab attachments__tab'>
                <Tile centered><TileIcon><FeatherIcon icon={'link'} /></TileIcon><TileContent>{ intl.formatMessage(intlMessages.addDicomTab) }</TileContent></Tile>
              </Tab>
            </TabList>
            <TabPanel>
              <div className='attachments__tab-content'>
                <Files
                  files={files}
                  onChange={(files) => {
                    this.setState({
                      files
                    })
                  }}
                />
              </div>
            </TabPanel>
            <TabPanel>
              <div className='attachments__tab-content'>
                <ParametersForm
                  errors={errors && errors.measurements}
                  items={measurements}
                  onParamChange={this.paramChanged}
                  onChange={(params) => {
                    this.setState({
                      measurements: params
                    })
                  }}
                  onAddClick={() => {
                    this.setState({
                      measurements: measurements.concat([{ ...PARAM_SCHEME }])
                    })
                  }}
                />
              </div>
            </TabPanel>
            <TabPanel>
              <div className='attachments__tab-content'>
                <DicomFiles
                  items={dicomFiles}
                  onChange={(dicomFiles) => {
                    this.setState({
                      dicomFiles
                    })
                  }}
                  onAddClick={() => {
                    this.setState({
                      dicomFiles: dicomFiles.concat([{ url: '', description: '' }])
                    })
                  }}
                />
              </div>
            </TabPanel>
          </Tabs>
        </Template>

        <Template if={recordType === 'medications'}>
          <MedicationsForm
            errors={errors && errors.medications}
            defaultItems={medications}
            onAddClick={() => {
              this.setState({
                medications: medications.concat([{...DRUG_SCHEME}])
              })
            }}
            onChange={(medications) => {
              this.setState({
                medications
              })
            }}
          />
        </Template>

        <Template if={recordType === 'personal'}>
          <ParametersForm
            items={measurements}
            onParamChange={this.paramChanged}
            errors={errors && errors.measurements}
            onChange={(params) => {
              this.setState({
                measurements: params
              })
            }}
            onAddClick={() => {
              this.setState({
                measurements: measurements.concat([{ ...PARAM_SCHEME }])
              })
            }}
          />
        </Template>
      </div>

      <MediaQuery rule='(max-width: 655px)'>
        <CardFooter>
          <div className='add-form-subs' style={{ marginBottom: '1.25rem' }}>
            { accessSelect }
          </div>
          <div style={{ textAlign: 'center' }}>
            { buttons }
          </div>
        </CardFooter>
      </MediaQuery>
    </form>
  }
}

RecordFormBase.defaultProps = {
  method: 'post',
  sections: [],
  onSuccess: noop
}

const RecordForm = injectIntl(withRouter(RecordFormBase))

export { RecordForm }
