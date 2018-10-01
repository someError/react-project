import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import cloneDeep from 'lodash/cloneDeep'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'

import { Uploader, File } from '../../../../components/Files'
import MediaQuery from '../../../../components/MediaQuery'
import { noop } from '../../../../util'
import Progress from '../../../../components/Loader/Progress'

class Files extends PureComponent {
  constructor () {
    super()

    this.state = {
      uploading: false,
      progress: 0
    }
  }

  addUploadedFile (f) {
    const files = cloneDeep(this.props.files)

    files.push(f)

    this.props.onChange(files)
  }

  removeFile (id) {
    const files = cloneDeep(this.props.files)

    this.uploader.pl.removeFile(id)
    this.props.onChange(files.filter((f) => f.id !== id))
  }

  render () {
    return <div>
      <div className='files-grid'>
        {
          this.props.files
            .map(({fileSize, fileType, ...file}) => <div key={file.id}>
              <File
                onRemove={() => { this.removeFile(file.id) }}
                size={fileSize}
                type={fileType}
                {...file}
                removable
              />
            </div>)
        }
      </div>
      <Uploader
        ref={(uploader) => { this.uploader = uploader }}
        autoUpload
        multiple
        filters={{
          mime_types: [
            { title: 'Image files', extensions: 'jpg,gif,png' },
            { title: 'PDF', extensions: 'pdf' },
            { title: 'Office files', extensions: 'doc,docx,xls,xlsx' }
          ]
        }}
        onStart={() => {
          this.setState({
            uploading: true,
            progress: 0
          })
        }}
        onUploadProgress={(pl) => {
          this.setState({
            progress: pl.total.percent
          })
        }}
        onFileUploaded={(pl, file, res) => {
          const data = JSON.parse(res.response).data
          file.id = data.id
          this.addUploadedFile({
            ...JSON.parse(res.response).data,
            plId: file.id
          })
        }}
        onUploadComplete={() => {
          this.setState({
            uploading: false,
            progress: 0
          })
        }}
      >
        <div className='uploader-area'>
          {
            !this.state.uploading
              ? <div>
                <div>
                  <MediaQuery rule='(min-width: 656px)'>
                    <FormattedHTMLMessage id='upload_area_text' defaultMessage='Перетащите файлы в отмеченную область<br />или нажмите ссылку <span class="uploader-area__link">загрузить</span>' />
                  </MediaQuery>

                  <MediaQuery rule='(max-width: 655px)'>
                    <span className='uploader-area__link'><FormattedMessage id='choose_files' defaultMessage='Выбрать файлы' /></span>
                  </MediaQuery>
                </div>
                <div className='uploader-area--allowed'><FormattedMessage id='files_formats' defaultMessage='Расширения файлов для загрузки: pdf, doc, xls, jpg, png' /></div>
              </div>
              : <div><Progress percent={this.state.progress} /></div>
          }
        </div>
      </Uploader>
    </div>
  }
}

File.propTypes = {
  onChange: PropTypes.func
}

File.defaultProps = {
  onChange: noop
}

export default Files
