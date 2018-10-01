import React, { Component } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import moment from 'moment'
import unionWith from 'lodash/unionWith'
import sortBy from 'lodash/sortBy'
import PreventParentScroll from 'prevent-parent-scroll'
import { FormattedMessage } from 'react-intl'

import Badge from '../Badge'
import FeatherIcon from '../Icons/FeatherIcon'
import api from '../../api'
import Card from '../Card/Card'
import Popper from 'popper.js'

import './Notifications.css'
import Template from '../Template'
import { Tile, TileContent, TileIcon } from '../Tile'
import InfiniteScroll from '../InfiniteScroll'

const TEXT_PARSE_REGEX = /<a.*href="(.*)".*>(.*)<\/a>/img

const getLinkFromText = (text) => {
  const parse = TEXT_PARSE_REGEX.exec(text)

  if (parse && parse[1]) {
    return parse[1].replace(/http(s?):\/\/((new.)?)phr.kz/, '')
  } else {
    return ''
  }
}

const replaceTextLink = (text) => {
  return text.replace(TEXT_PARSE_REGEX, '<span>$2</span>')
}

class Notifications extends Component {
  constructor () {
    super()

    this.state = {
      total: null,
      items: [],
      show: false,
      hasMore: false,
      loading: false
    }
    this.toggleClick = this.toggleClick.bind(this)
    this.hide = this.hide.bind(this)
    this.documentClick = this.documentClick.bind(this)
  }

  documentClick (e) {
    if (!this.props.disabled && !this.pop.contains(e.target) && this.state.show) {
      setTimeout(() => {
        this.hide(e)
      }, 50)
    }
  }

  hide (e) {
    if (this.props.disabled) return
    this.setState({
      show: false
    })
  }

  toggleClick (e) {
    if (this.props.disabled) return

    // e.stopPropagation()
    e.nativeEvent.stopPropagation()
    // e.nativeEvent.stopImmediatePropagation()

    this.setState({
      show: !this.state.show
    })
  }

  requestNotifications (params) {
    this.req = api.getUnreadNotifications(params)

    this.setState({
      loading: true
    })

    return this.req
      .then(({data: {data}}) => {
        this.currentPage = data.meta.current_page

        this.setState((state) => {
          const nextItems = sortBy(unionWith(this.state.items, data.items, (a, b) => a.id === b.id), [(o) => -moment(o.createdAt).valueOf()])

          return {
            total: data.meta.total > 0 ? data.meta.total : null,
            items: nextItems,
            hasMore: data.meta.current_page !== data.meta.total_pages,
            loading: false
          }
        })
      })
  }

  componentWillUpdate (nextProps, nextState) {
    // if (!nextState.show) {
    //   this.pop.style.transform = ''
    // }
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.show !== this.state.show) {
      // this.popper.update()

      if (this.state.show) {
        this.stopWatch()
      } else {
        this.watch()
        // TODO: возможно как-то подругому надо
        /* eslint react/no-did-update-set-state: off */
        this.setState({
          items: []
        })
      }

      if (this.state.show) {
        this.scrollPrevent.start()
      } else {
        this.scrollPrevent.stop()
      }
    }

    if (this.state.show) {
      this.pop.style.transform = ''
      this.popper.update()
    }

    this.scrollPrevent = new PreventParentScroll(this.scrollContainer)
  }

  componentDidMount () {
    this.requestNotifications()
      .then(() => {
        this.watch()
      })

    this.popper = new Popper(this.root, this.pop, {
      placement: 'bottom-end',
      arrowElement: this.arrow,
      originalPlacement: 'bottom-end',
      modifiers: {
        preventOverflow: {
          padding: 0
        }
      }
    })

    document.body.addEventListener('click', this.documentClick, true)
  }

  componentWillUnmount () {
    this.popper.destroy()

    document.body.removeEventListener('click', this.documentClick, true)
    this.stopWatch()

    try {
      this.scrollPrevent.stop()
    } catch (e) {}
  }

  watch () {
    if (this.interval) {
      this.stopWatch()
    }

    this.requestNotifications()

    this.interval = setInterval(() => {
      this.requestNotifications()
    }, 30 * 1000)
  }

  stopWatch () {
    if (this.interval) {
      clearInterval(this.interval)
    }
  }

  render () {
    return <Template>
      <span onClick={this.toggleClick} ref={(root) => { this.root = root }}>
        <Badge value={this.state.total}>
          <FeatherIcon size={22} icon={'bell'} />
        </Badge>
      </span>

      {
        createPortal(
          <div
            className='notifications-popover'
            style={{ display: this.state.show ? 'block' : 'none' }}
            ref={(pop) => { this.pop = pop }}
          >
            <div className='notifications-popover__arrow' x-arrow='' ref={(arrow) => { this.arrow = arrow }} />
            <Card>
              <div className='notifications-list__header'>
                <Tile centered>
                  <TileContent>
                    <FormattedMessage
                      id='notifications.popover.title'
                      defaultMessage='Уведомления'
                    />
                  </TileContent>
                  <TileIcon>
                    <span onClick={this.hide}>
                      <FeatherIcon size={21} icon='x' />
                    </span>
                  </TileIcon>
                </Tile>
              </div>
              <div
                ref={(scrollContainer) => { this.scrollContainer = scrollContainer }}
                className='notifications-list'
              >
                <InfiniteScroll
                  loading={this.state.loading}
                  hasMore={this.state.hasMore}
                  onRequestMore={() => { this.requestNotifications({page: this.currentPage + 1}) }}
                  renderSpinner={(spinner) => <div style={{ minHeight: '30px' }}>{ React.cloneElement(spinner, { size: 'sm' }) }</div>}
                >
                  <ul>
                    {
                      this.state.items.map((n) => {
                        const url = getLinkFromText(n.text)

                        const body = <Template>
                          <div className='color-gray text-xs'>{ moment(n.createdAt).format('DD.MM.YYYY в HH:mm') }</div>
                          <div
                            className='notification-item-text'
                            dangerouslySetInnerHTML={{ __html: replaceTextLink(n.text) }}
                          />
                        </Template>

                        return <li className='text-sm' key={n.id}>
                          {
                            url
                              ? <Link
                                onClick={() => {
                                  this.hide()
                                  api.setNotificationRead(n.id)
                                }}
                                to={url}
                              >
                                { body }
                              </Link>
                              : <a>{ body }</a>
                          }
                        </li>
                      })
                    }
                  </ul>
                </InfiniteScroll>
              </div>
            </Card>
          </div>,
          document.body
        )
      }
    </Template>
  }
}

export default Notifications
