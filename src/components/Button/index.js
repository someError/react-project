import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import './Button.css'
import { ModalLink } from '../Router'

const Button = ({ className, loading, href, to, link, size, ghost, fill, pink, modal, round, white, ...props }) => {
  const clsName = classNames(
    'btn',
    className,
    {
      loading: loading,
      'btn--link': link,
      [`btn--${size}`]: !!size,
      'btn--ghost': ghost,
      'btn--fill': fill,
      'btn--round': round,
      'btn--white': white,
      'btn--pink': pink
    })

  const componentProps = {
    className: clsName,
    ...props
  }

  if (href) {
    return <a {...componentProps} href={href}>{ componentProps.children }</a>
  } else if (to) {
    if (!modal) {
      return <Link {...componentProps} to={to} />
    } else {
      return <ModalLink {...componentProps} to={to} />
    }
  } else {
    return <button {...componentProps} />
  }
}

Button.propTypes = {
  ghost: PropTypes.bool,
  loading: PropTypes.bool,
  link: PropTypes.bool,
  href: PropTypes.string,
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  size: PropTypes.oneOf(['sm', 'lg', 'xs']),
  className: PropTypes.string,
  modal: PropTypes.bool
}

Button.defaultProps = {
  ghost: false,
  loading: false,
  link: false,
  modal: false
}

export default Button
