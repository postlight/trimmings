import bind from './bind'
import { selectors as autosubmitSelectors } from './autosubmit'
import { selectors as inlineSelectors } from './inline'
import { selectors as embedSelectors } from './embed'
import { selectors as removeSelectors } from './remove'
import { selectors as replaceSelectors } from './replace'
import { selectors as toggleSelectors } from './toggle'

const selectors =
  []
    .concat(autosubmitSelectors)
    .concat(inlineSelectors)
    .concat(embedSelectors)
    .concat(removeSelectors)
    .concat(replaceSelectors)
    .concat(toggleSelectors)
    .join(',')

const bindChildren = (container) => {
  document.body.classList.add('redact')

  Array.prototype.forEach.call(container.querySelectorAll(selectors), (element) => {
    bind(element)
  })
}

export default bindChildren
