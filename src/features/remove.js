export const name = 'Remove'

export const handle = (e) => {
  const selector = e.target.dataset.redactRemove
  const toRemove = document.querySelector(selector)
  if (toRemove && toRemove.parentNode) {
    toRemove.parentNode.removeChild(toRemove)
  }
}
