import parseArgs from './parseArgs'

const registered = []

export const selectors = [
  'a[data-redact-hotkey]',
  'button[data-redact-hotkey]'
]

export const listen = () => {
  window.addEventListener('keydown', (e) => {
    const { controlKey, shiftKey, altKey, metaKey, keyCode } = e

    const input =
      `${String.fromCharCode(keyCode)} ${controlKey ? 'ctrl' : ''} ${shiftKey ? 'shift' : ''} ${metaKey ? 'meta' : ''} ${altKey ? 'alt' : ''}`
        .trim()
        .toLowerCase()
        .split(/\s+/g)
        .sort()

    const element = (registered.find(hotkey => hotkey[1].join(',') === input.join(',')) || [])[0]

    if (element) {
      element.click()
    }
  })
}

export const bind = (element) => {
  if (typeof element.dataset.redactHotkey !== 'undefined') {
    registered.push([element, parseArgs(element.dataset.redactHotkey.toLowerCase()).sort()])
  }
}
