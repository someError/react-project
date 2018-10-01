import React, { Children } from 'react'
import PropTypes from 'prop-types'
import { Transition } from 'react-transition-group'

const defaultStyle = (duration = 200, easing = 'ease') => ({
  transition: `opacity ${duration}ms ${easing}`
})

const transitionStyles = {
  entering: { opacity: 1 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 }
}

const Fade = ({in: inProp, duration, children}) => {
  const child = Children.only(children)

  return <Transition
    appear
    in={inProp}
    timeout={duration}
    mountOnEnter
    unmountOnExit
  >
    {
      (state) => {
        return React.cloneElement(child, {
          style: {
            ...defaultStyle(duration),
            ...transitionStyles[state]
          }
        })
      }
    }
  </Transition>
}

Fade.propTypes = {
  in: PropTypes.bool,
  duration: PropTypes.number
}

Fade.defaultProps = {
  in: true,
  duration: 200
}

export default Fade
