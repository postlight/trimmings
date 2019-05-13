import { render as currentRender } from '../features/current'
import { render as embedRender } from '../features/embed'
import { render as enabledRender } from '../features/enabled'

const render = (container) => {
  currentRender(container)
  embedRender(container)
  enabledRender(container)
}

export default render
