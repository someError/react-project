import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './Avatar.css'
import { getStorageFileUrl } from '../../util'

class Avatar extends PureComponent {
  constructor (props) {
    super()

    this.state = {
      loading: !!props.src
    }
  }

  render () {
    const { size, initial, alt, background, className } = this.props
    const loading = this.state.loading || this.props.loading

    let { src } = this.props

    switch (size) {
      case '3xl':
        src = getStorageFileUrl(src, 'w296h296fill')
        break
      case '2xl':
        src = getStorageFileUrl(src, 'w180h180fill')
        break
      case 'xl':
        src = getStorageFileUrl(src, 'w120h120fill')
        break
      case 'lg':
        src = getStorageFileUrl(src, 'w76h76fill')
        break
      case 'sm':
        src = getStorageFileUrl(src, 'w60h60fill')
        break
      case 'xs':
        src = getStorageFileUrl(src, 'w26h26fill')
        break
      default:
        src = getStorageFileUrl(src, 'w102h102fill')
    }

    const clsName = classNames('avatar', className, { [`avatar-${size}`]: !!size, loading: loading })

    const style = {
      background: background
    }

    return <figure className={clsName} data-initial={initial} style={style}>
      {
        src
          ? <img onLoad={() => { this.setState({ loading: false }) }} src={src} alt={alt} />
          : null
      }
    </figure>
  }
}

Avatar.propTypes = {
  size: PropTypes.oneOf(['3xl', '2xl', 'xl', 'lg', 'sm', 'xs']),
  src: PropTypes.string,
  alt: PropTypes.string,
  initial: PropTypes.string,
  loading: PropTypes.bool
}

export default Avatar
