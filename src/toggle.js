import match from './match'

export const selectors = [
  'button[data-redact-toggle]',
  'input[data-redact-toggle]'
]

export const bind = (element) => {
  if (match(element, 'BUTTON', 'redactToggle')) {
    const [targetSelector, className] = element.dataset.redactToggle.split(', ')
    element.addEventListener('click', () => {
      document.querySelector(targetSelector).classList.toggle(className)
    })
    element.removeAttribute('data-redact-toggle')
  }

  if (match(element, 'INPUT', 'redactToggle')) {
    const [targetSelector, className] = element.dataset.redactToggle.split(', ')
    element.addEventListener('change', () => {
      // TODO: this is not un-toggling for the previously-checked radio
      document.querySelector(targetSelector).classList.toggle(className, element.checked)
    })
    element.removeAttribute('data-redact-toggle')
  }
}
