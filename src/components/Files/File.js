import React from 'react'
import { injectIntl } from 'react-intl'
import { Tile, TileIcon, TileContent } from '../Tile'
import FileIcon from './FileIcon'
import { getFileExt, isImageMime } from '../../util'
import filesize from 'filesize'

import commonIntlMessages from '../../i18n/common-messages'

import './File.css'

const File = ({ title, size, url, type, removable, onRemove, intl }) => {
  return <Tile>
    <TileIcon>
      <a className='file-root' href={url} download>
        {
          isImageMime(type)
            ? <span className='file-image-preview' style={{ backgroundImage: `url(${url})` }} />
            : <FileIcon ext={getFileExt(url)} />
        }
      </a>
    </TileIcon>
    <TileContent>
      <div className='file-title'><a className='file-root' href={url} download>{ title }</a></div>
      <span className='file-size'>{ filesize(size) }</span> { removable ? <span onClick={() => { onRemove() }} style={{ cursor: 'pointer' }} className='color-red text-sm'>{ intl.formatMessage(commonIntlMessages.remove) }</span> : null }
    </TileContent>
  </Tile>
}

File.defaultProps = {
  removable: false
}

export default injectIntl(File)
