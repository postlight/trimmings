import { listen as hotkeysListen } from './hotkeys'
import bindChildren from './bindChildren'
import observe from './observe'

const init = () => {
  hotkeysListen()
  observe()
  bindChildren(document)
}

export default init
