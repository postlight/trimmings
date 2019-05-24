import isRegularClick from '../utils/isRegularClick'

export const key = 'trimRemove'

export const eventNames = ['click']

export const handle = (e) => {
  if (e.type === 'click' && !isRegularClick(e)) {
    return
  }

  const selector = e.target.dataset.trimRemove
  const toRemove = document.querySelector(selector)

  if (toRemove && toRemove.parentNode) {
    toRemove.parentNode.removeChild(toRemove)
  }
}
