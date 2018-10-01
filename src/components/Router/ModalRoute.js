import React, { Component } from 'react'
import { Route, withRouter } from 'react-router-dom'
import Modal from '../Modal'
import { Fade } from '../Transitions'

class ModalRoute extends Component {
  componentWillUpdate (nextProps) {
    if (nextProps.location.state && nextProps.location.state.fromUrl) {
      this.closeUrl = nextProps.location.state.fromUrl
    }
  }

  render () {
    const { component: Component, closeUrl, prevLocation, render, isModal, modalClassName, modalContainerClassName, ...rest } = this.props
    console.log(this.props)
    return <Route
      {...rest}
      render={
        (props) => {
          let rendered

          if (Component) {
            rendered = <Component closeUrl={closeUrl} {...props} modal />
          } else if (render) {
            rendered = render(props)
          } else {
            rendered = null
          }

          return <Fade duration={isModal ? 200 : 0}>
            <Modal
              containerClassName={modalContainerClassName}
              onRequestClose={
                () => {
                  // TODO: подумать над ссылкой на закрытие при прямом переходе
                  console.log(this.closeUrl)
                  props.history.push(this.closeUrl || closeUrl)
                }
              }
            >
              {rendered}
            </Modal>
          </Fade>
        }
      }
    />
  }
}

export default withRouter(ModalRoute)
