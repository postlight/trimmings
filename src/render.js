import { render as currentRender } from './current'
import { render as embedRender } from './embed'
import { render as enabledRender } from './enabled'

const render = (container) => {
  currentRender(container)
  embedRender(container)
  enabledRender(container)
}

export default render
