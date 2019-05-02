import { bind as autosubmitBind } from './autosubmit'
import { bind as hotkeysBind } from './hotkeys'
import { bind as inlineBind } from './inline'
import { bind as prefetchBind } from './prefetch'
import { bind as removeBind } from './remove'
import { bind as replaceBind } from './replace'
import { bind as toggleBind } from './toggle'

const bind = (element) => {
  prefetchBind(element)
  replaceBind(element)
  inlineBind(element)
  toggleBind(element)
  removeBind(element)
  autosubmitBind(element)
  hotkeysBind(element)
}

export default bind
