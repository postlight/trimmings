import parseArgs from './parseArgs'

export const selectors = [
  'button[data-redact-toggle]',
  'input[data-redact-toggle]'
]

const inputHandler = (element, targetSelector, className) =>
  () => {
    const type = element.getAttribute('type')

    if (['radio', 'checkbox'].includes(type)) {
      document
        .querySelector(targetSelector)
        .classList
        .toggle(className, element.checked)

      if (type === 'radio') {
        if (element.dataset.redactChainToggle === 'true') {
          element.dataset.redactChainToggle = null
          return
        }

        const name = element.getAttribute('name')
        const radios =
          document.querySelectorAll(`input[type="radio"][name="${name}"]`)

        Array.prototype.forEach.call(radios, (radio) => {
          if (radio === element) {
            return
          }

          radio.dataset.redactChainToggle = 'true'
          radio.dispatchEvent(new window.Event('change'))
        })
      }
    } else {
      console.log('length', (element.value || '').toString().length)
      document
        .querySelector(targetSelector)
        .classList
        .toggle(className, (element.value || '').toString().length > 0)
    }
  }

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
    const handler = inputHandler(element, targetSelector, className)
    element.addEventListener('input', handler)
    element.addEventListener('change', handler)
  }

  element.removeAttribute('data-redact-toggle')
}
