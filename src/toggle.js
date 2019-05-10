import parseArgs from './parseArgs'

export const handle = (e) => {
  const element = e.target

  const [targetSelector, className] =
    parseArgs(element.dataset.redactToggle).args

  if (element.nodeName === 'BUTTON') {
    document.querySelector(targetSelector).classList.toggle(className)
  } else if (element.nodeName === 'INPUT') {
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
          console.log('change', radio.value)
          radio.dispatchEvent(new window.Event('change', { bubbles: true }), true)
        })
      }
    } else {
      document
        .querySelector(targetSelector)
        .classList
        .toggle(className, (element.value || '').toString().length > 0)
    }
  }
}
