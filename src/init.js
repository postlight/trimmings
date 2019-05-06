import { listen as hotkeysListen } from './hotkeys'
import bindChildren from './bindChildren'
import observe from './observe'

const init = () => {
  hotkeysListen()
  observe()
  bindChildren(document)
  document.addEventListener('turbolinks:render', () => {
    // TODO: This is probably inefficient and we should maybe be more careful
    // about creating new MutationObservers
    observe()
    bindChildren(document)
  })
}

export default init
