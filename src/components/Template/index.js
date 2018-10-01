import PropTypes from 'prop-types'

const Template = (props) => {
  return props.if ? (props.children || null) : null
}

Template.propTypes = {
  if: PropTypes.bool
}

Template.defaultProps = {
  if: true
}

export default Template
