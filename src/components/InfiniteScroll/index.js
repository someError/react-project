import React from 'react'
import PropTypes from 'prop-types'
import Template from '../Template'
import InViewObserver from '../Inview/InViewObserver'
import Spinner from '../Loader/Spinner'
import { noop } from '../../util'

const InfiniteScroll = (props) => {
  const spinner = <Spinner />

  return <Template>
    { props.children }

    { !props.hasMore && props.loading && props.renderSpinner(spinner) }

    {
      props.hasMore
        ? (
          <InViewObserver
            onEnter={() => {
              props.onRequestMore()
            }}
          >
            <div style={{ minHeight: '1px' }}>
              { props.loading && props.renderSpinner(spinner) }
            </div>
          </InViewObserver>
        )
        : null
    }
  </Template>
}

InfiniteScroll.propTypes = {
  onRequestMore: PropTypes.func,
  hasMore: PropTypes.bool,
  loading: PropTypes.bool
}

InfiniteScroll.defaultProps = {
  onRequestMore: noop,
  loading: false,
  renderSpinner: (spinner) => spinner
}

export default InfiniteScroll
