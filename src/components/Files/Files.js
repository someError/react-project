import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import cloneDeep from 'lodash/cloneDeep'
import classNames from 'classnames'

import { Uploader, File } from './index'
import MediaQuery from '../MediaQuery'
import { noop } from '../../util'

class Files extends PureComponent {
  addUploadedFile (f) {
    const files = cloneDeep(this.props.files)

    files.push(f)

    this.props.onChange(files)
  }

  render () {
    const { props } = this
    const { error } = this.props

    return <div className={classNames('files-uploader', {error})}>
      <div className='files-grid'>
        {
          this.props.multiple
            ? this.props.files.map(({fileSize, fileType, ...file}) => <File key={file.id} size={fileSize} type={fileType} {...file} />)
            : props.files && <File key={props.files.id} size={props.files.fileSize} type={props.files.fileType} {...props.files} />
        }
      </div>
      <Uploader
        autoUpload
        multiple={this.props.multiple}
        filters={{
          mime_types: [
            { title: 'Image files', extensions: 'jpg,gif,png' },
            { title: 'PDF', extensions: 'pdf' },
            { title: 'Office files', extensions: 'doc,docx,xls,xlsx' }
          ]
        }}
        onFileUploaded={(pl, file, res) => {
          this.props.multiple
            ? this.addUploadedFile(JSON.parse(res.response).data)
            : this.props.onChange(JSON.parse(res.response).data)
        }}
      >
        <div className='uploader-area'>
          <div>
            <MediaQuery rule='(min-width: 656px)'>
              Перетащите { props.multiple ? 'файлы' : 'файл' } в отмеченную область<br />
              или нажмите ссылку <span className='uploader-area__link'>загрузить</span>
            </MediaQuery>

            <MediaQuery rule='(max-width: 655px)'>
              <span className='uploader-area__link'>{ props.multiple ? 'Выбрать файлы' : 'Выбрать файл' }</span>
            </MediaQuery>
          </div>
          <div className='uploader-area--allowed'>Расширения файлов для загрузки: pdf, doc, xls, jpg, png</div>
        </div>
      </Uploader>
      { error && typeof error === 'string' && <i className='material-input__error'>{ error }</i> }
    </div>
  }
}

Files.propTypes = {
  onChange: PropTypes.func
}

Files.defaultProps = {
  onChange: noop
}

export default Files
