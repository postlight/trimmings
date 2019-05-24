import isHidden from '../utils/isHidden'
import load from '../utils/load'

export const key = 'trimToggle'

export const eventNames = ['click', 'input', 'change']

export const render = (container) => {
  Array.prototype.forEach.call(container.querySelectorAll('a[data-trim-embed]'), element => {
    if (isHidden(element) || element.classList.contains('trim-loading')) {
      return
    }

    if (!element.parentNode || !element.getAttribute('href')) {
      return
    }

    const targetSelector = element.dataset.trimEmbed || 'body'
    element.classList.add('trim-loading')
    load(element.getAttribute('href')).then((doc) => {
      const newNode = doc.querySelector(targetSelector)
      if (doc) {
        element.parentNode.replaceChild(newNode, element)
      } else {
        element.classList.remove('trim-loading')
      }
    })
  })
}
