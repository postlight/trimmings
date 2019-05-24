import isRegularClick from '../utils/isRegularClick'
import parseArgs from '../utils/parseArgs'
import toggleClass from '../utils/toggleClass'

export const key = 'trimToggle'

export const eventNames = ['click', 'input', 'change']

export const handle = (e) => {
  const element = e.target

  const [targetSelector, className] =
    parseArgs(element.dataset.trimToggle).args

  const target = document.querySelector(targetSelector)

  if (!target) {
    return
  }

  let state = null

  if (element.nodeName === 'BUTTON') {
    if (e.type === 'click' && !isRegularClick(e)) {
      return
    }

    state = !target.classList.contains(className)
  } else if (element.nodeName === 'INPUT') {
    const type = element.getAttribute('type')

    if (['radio', 'checkbox'].includes(type)) {
      state = element.checked

      if (type === 'radio') {
        if (element.dataset.trimChainToggle === 'true') {
          element.dataset.trimChainToggle = null
        } else {
          const name = element.getAttribute('name')
          const radios =
            document.querySelectorAll(`input[type="radio"][name="${name}"]`)

          Array.prototype.forEach.call(radios, (radio) => {
            if (radio === element) {
              return
            }

            radio.dataset.trimChainToggle = 'true'
            radio.dispatchEvent(new window.Event('change', { bubbles: true }), true)
          })
        }
      }
    } else {
      state = (element.value || '').toString().length > 0
    }
  }

  toggleClass(target, className, state)
}
