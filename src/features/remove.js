export const key = 'redactRemove'

export const eventNames = ['click']

export const handle = (e) => {
  const selector = e.target.dataset.redactRemove
  const toRemove = document.querySelector(selector)
  if (toRemove && toRemove.parentNode) {
    toRemove.parentNode.removeChild(toRemove)
  }
}
