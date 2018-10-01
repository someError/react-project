import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import plupload from 'plupload'
import api from '../../api'
import { noop } from '../../util'
import { RU } from '../../util/plupload'

plupload.addI18n(RU)

/**
 * Uploader. Построен над plupload(http://www.plupload.com/)
 * Низкоуровневый – превращает дочерный элемент в кнопку browse для файлов и загружает файлы, не включает в себя никаких прогрессов загрузки и превью файлов
 * Поддерживаемые сво-ва:
 * autoUpload – загрузка файлов сразу после выбора
 * multiple – выбор нескольких файлов
 * filters – фильтры для файлов (http://www.plupload.com/docs/v2/File-Filters)
 *
 * События:
 * onStateChanged, onFilesAdded, onFilesRemoved, onBeforeUpload, onUploadFile, onUploadProgress, onBeforeChunkUpload, onFileUploaded, onUploadComplete, onError, onDestroy – события plupload http://www.plupload.com/docs/v2/Uploader#events всё там написано, здесь не буду расписывать
 *
 * onStart – начало загрузки очереди
 * onStop – остановка загрузки очереди
 */
class Uploader extends PureComponent {
  componentDidMount () {
    const {
      onStart,
      onStop,
      onStateChanged,
      onFilesAdded,
      onFilesRemoved,
      onBeforeUpload,
      onUploadFile,
      onUploadProgress,
      onBeforeChunkUpload,
      onFileUploaded,
      onUploadComplete,
      onError,
      onDestroy,
      multiple,
      autoUpload,
      filters
    } = this.props

    this.pl = new plupload.Uploader({
      runtimes: 'html5',
      browse_button: this.root,
      drop_element: this.root,
      url: api.getFilesUrl(),
      filters,
      multi_selection: multiple,
      headers: api.getAuthHeaders(),
      init: {
        FilesAdded: (...args) => {
          onFilesAdded(...args)

          if (autoUpload) {
            this.pl.start()
          }
        },
        StateChanged: (pl) => {
          if (pl.state === plupload.STARTED) {
            onStart(pl)
          } else if (pl.state === plupload.STOPPED) {
            onStop(pl)
          }

          onStateChanged(pl)
        },
        QueueChanged: (...args) => { console.log(args) },
        FilesRemoved: (...args) => { onFilesRemoved(...args) },
        BeforeUpload: (...args) => { onBeforeUpload(...args) },
        UploadFile: (...args) => { onUploadFile(...args) },
        UploadProgress: (...args) => { onUploadProgress(...args) },
        BeforeChunkUpload: (...args) => { onBeforeChunkUpload(...args) },
        FileUploaded: (...args) => { onFileUploaded(...args) },
        UploadComplete: (...args) => { onUploadComplete(...args) },
        Error: (...args) => { onError(...args) },
        Destroy: (...args) => { onDestroy(...args) }
      }
    })

    this.pl.init()
  }

  componentWillUnmount () {
    if (this.pl) {
      try {
        this.pl.destroy()
      } catch (e) {
        this.pl = null
      }
    }
  }

  render () {
    const {
      children,
      className
    } = this.props

    return <span ref={(root) => { this.root = root }} className={className}>{ children }</span>
  }
}

Uploader.propTypes = {
  multiple: PropTypes.bool,
  filters: PropTypes.object,
  autoUpload: PropTypes.bool,
  onStart: PropTypes.func,
  onStop: PropTypes.func,
  onStateChanged: PropTypes.func,
  onFilesAdded: PropTypes.func,
  onFilesRemoved: PropTypes.func,
  onBeforeUpload: PropTypes.func,
  onUploadFile: PropTypes.func,
  onUploadProgress: PropTypes.func,
  onBeforeChunkUpload: PropTypes.func,
  onFileUploaded: PropTypes.func,
  onUploadComplete: PropTypes.func,
  onError: PropTypes.func,
  onDestroy: PropTypes.func
}

Uploader.defaultProps = {
  multiple: false,
  filters: {},
  autoUpload: false,
  onStart: noop,
  onStop: noop,
  onStateChanged: noop,
  onFilesAdded: noop,
  onFilesRemoved: noop,
  onBeforeUpload: noop,
  onUploadFile: noop,
  onUploadProgress: noop,
  onBeforeChunkUpload: noop,
  onFileUploaded: noop,
  onUploadComplete: noop,
  onError: noop,
  onDestroy: noop
}

export default Uploader
