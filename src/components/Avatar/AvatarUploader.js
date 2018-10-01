import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import FeatherIcon from '../../components/Icons/FeatherIcon'

import { Uploader } from '../../components/Files'
import { noop } from '../../util'
import Avatar from './Avatar'
import './AvatarUploader.css'

class AvatarUploader extends PureComponent {
  constructor () {
    super()
    this.state = {
      loading: false
    }
  }
  render () {
    return <div className='avatar-uploader-wrap'>
      <div className='avatar-uploader'>
        <Uploader
          style={{position: 'relative'}}
          autoUpload
          filters={{
            mime_types: [
              { title: 'Image files', extensions: 'jpg,gif,png' }
            ]
          }}
          onStart={() => this.setState({ loading: true })}
          onFileUploaded={(pl, file, res) => {
            this.props.onChange(JSON.parse(res.response).data)
            this.setState({ loading: false })
          }}
        >
          <Avatar
            size='3xl'
            loading={this.state.loading}
            src={this.props.src}
            initial={this.props.initial}
          />
          <span className='avatar-uploader__link'><FeatherIcon size={14} icon='upload' /> Загрузить новое</span>
        </Uploader>
        {
          this.props.src &&
          <span
            className='avatar-uploader__link avatar-uploader__link--clear'
            onClick={this.props.onClear}
          >
            <FeatherIcon size={12} icon='x' />Удалить
          </span>
        }
      </div>
    </div>
  }
}

AvatarUploader.propTypes = {
  onChange: PropTypes.func
}

AvatarUploader.defaultProps = {
  onChange: noop
}

export default AvatarUploader
