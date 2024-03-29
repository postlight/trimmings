import isHidden from '../utils/isHidden'
import load from '../utils/load'

export const key = 'trimmingsToggle'

export const eventNames = ['click', 'input', 'change']

export const render = (container) => {
  Array.prototype.forEach.call(container.querySelectorAll('a[data-trimmings-embed]'), element => {
    if (isHidden(element) || element.classList.contains('trimmings-loading')) {
      return
    }

    if (!element.parentNode || !element.getAttribute('href')) {
      return
    }

    const targetSelector = element.dataset.trimmingsEmbed || 'body'
    element.classList.add('trimmings-loading')
    load(element.getAttribute('href')).then((doc) => {
      const newNode = doc.querySelector(targetSelector)
      if (doc) {
        element.parentNode.replaceChild(newNode, element)
      } else {
        element.classList.remove('trimmings-loading')
      }
    })
  })
}
