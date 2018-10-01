import { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { noop } from '../../util'

/**
 * Компонент для «программного» адаптива.
 * использование: <MediaQuery rule='(max-width: 1000px)'><div>видно при ширине окна <=1000</div></MediaQuery>
 * принимает свойство rule – любой валидный css media query
 * если указанный media query матчится, то содержимое компонента отрендерится, в противном случае – ничего не выведется
 */
class MediaQuery extends PureComponent {
  constructor () {
    super()

    this.state = {
      matches: false
    }

    this.changeListener = this.changeListener.bind(this)
  }

  handleOnChange () {
    const { matches } = this.matchMedia

    this.props.onChange(matches, this.matchMedia)
  }

  changeListener () {
    const { matches } = this.matchMedia
    this.setState({
      matches: matches
    })

    this.handleOnChange()
  }

  componentDidMount () {
    this.matchMedia = window.matchMedia(this.props.rule)

    this.setState({
      matches: this.matchMedia.matches
    })

    this.matchMedia.addListener(this.changeListener)

    if (this.matchMedia.matches) {
      this.handleOnChange()
    }
  }

  componentWillUnmount () {
    this.matchMedia.removeListener(this.changeListener)
  }

  render () {
    const { children } = this.props
    const { matches } = this.state

    return matches ? children || null : null
  }
}

MediaQuery.propTypes = {
  rule: PropTypes.string.isRequired,
  onChange: PropTypes.func
}

MediaQuery.defaultProps = {
  onChange: noop
}

export default MediaQuery
