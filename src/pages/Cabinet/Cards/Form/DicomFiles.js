import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, defineMessages } from 'react-intl'
import { MaterialInput } from '../../../../components/Form'
import FeatherIcon from '../../../../components/Icons/FeatherIcon'
import cloneDeep from 'lodash/cloneDeep'
import { noop } from '../../../../util'

import commonIntlMessages from '../../../../i18n/common-messages'

const intlMessages = defineMessages({
  addLink: {
    id: 'dicom.add_link',
    defaultMessage: 'Добавить ссылку'
  }
})

class DicomFiles extends PureComponent {
  updateDicom (i, data) {
    const items = cloneDeep(this.props.items)

    items[i] = {
      ...items[i],
      ...data
    }

    return items
  }

  render () {
    const { onChange, items, onAddClick, intl } = this.props

    return <div className='form-grid'>
      {
        items.map((item, i) => <div key={i}>
          <div className='columns'>
            <MaterialInput
              value={item.url}
              label={intl.formatMessage(commonIntlMessages.labelLink)}
              onChange={(e) => {
                onChange(this.updateDicom(i, { url: e.target.value }))
              }}
            />
          </div>
          <div className='columns'>
            <MaterialInput
              value={item.description}
              label={intl.formatMessage(commonIntlMessages.labelDescription)}
              onChange={(e) => {
                onChange(this.updateDicom(i, { description: e.target.value }))
              }}
            />
          </div>
        </div>)
      }

      <span className='add-param' onClick={onAddClick}>
        <FeatherIcon icon='plus-circle' size={20} /> { intl.formatMessage(intlMessages.addLink) }
      </span>
    </div>
  }
}

DicomFiles.propTypes = {
  onChange: PropTypes.func
}

DicomFiles.defaultProps = {
  onChange: noop
}

export default injectIntl(DicomFiles)
