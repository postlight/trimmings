import parseArgs from './parseArgs'

export const selectors = [
  'button[data-redact-toggle]',
  'input[data-redact-toggle]'
]

export const bind = (element) => {
  if (typeof element.dataset.redactToggle === 'undefined') {
    return
  }

  const [targetSelector, className] = parseArgs(element.dataset.redactToggle)

  if (element.nodeName === 'BUTTON') {
    element.addEventListener('click', () => {
      document.querySelector(targetSelector).classList.toggle(className)
    })
  } else if (element.nodeName === 'INPUT') {
    element.addEventListener('change', () => {
      // TODO: this is not un-toggling for the previously-checked radio
      document
        .querySelector(targetSelector)
        .classList
        .toggle(className, element.checked)
    })
  }

  element.removeAttribute('data-redact-toggle')
}
