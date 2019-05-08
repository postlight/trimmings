import { bind as autosubmitBind } from './autosubmit'
import { bind as inlineBind } from './inline'
import { bind as embedBind } from './embed'
import { bind as removeBind } from './remove'
import { bind as replaceBind } from './replace'
import { bind as toggleBind } from './toggle'

const bind = (element) => {
  embedBind(element)
  replaceBind(element)
  inlineBind(element)
  toggleBind(element)
  removeBind(element)
  autosubmitBind(element)
}

export default bind
