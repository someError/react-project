import { connect } from 'react-redux'

export default function (Component) {
  const mapStateToProps = ({ user }) => {
    return {
      user
    }
  }

  return connect(mapStateToProps)(Component)
}
