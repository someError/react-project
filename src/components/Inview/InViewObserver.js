import { Children } from 'react'

import inView from './inView'

let InViewObserver = ({ children }) => Children.only(children)

InViewObserver = inView(InViewObserver)

export default InViewObserver
