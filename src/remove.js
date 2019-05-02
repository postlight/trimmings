import match from './match'

export const selectors = [
  'button[data-redact-remove]'
]

export const bind = (element) => {
  if (match(element, 'BUTTON', 'redactRemove')) {
    const selector = element.dataset.redactRemove
    element.addEventListener('click', () => {
      const toRemove = document.querySelector(selector)
      toRemove.parentNode.removeChild(toRemove)
    })
    element.removeAttribute('data-redact-remove')
  }
}
