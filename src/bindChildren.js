import bind from './bind'
import { selectors } from './hotkeys'

const bindingSelectors = [
  'a[data-redact-prefetch]',
  'a[data-redact-inline]',
  'form[data-redact-inline]',
  'a[data-redact-replace]',
  'form[data-redact-replace]',
  'button[data-redact-toggle]',
  'input[data-redact-toggle]',
  'button[data-redact-remove]',
  'form[data-redact-autosubmit]',
  'button[data-redact-autosubmit]',
  'input[data-redact-autosubmit]',
  'select[data-redact-autosubmit]',
  'textarea[data-redact-autosubmit]'
].concat(selectors)

const BINDING_SELECTORS = bindingSelectors.join(',')

const bindChildren = (container) => {
  Array.prototype.forEach.call(container.querySelectorAll(BINDING_SELECTORS), (element) => {
    bind(element)
  })
}

export default bindChildren
