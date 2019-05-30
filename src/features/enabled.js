export const key = 'trimmingsToggle'

export const eventNames = ['click', 'input', 'change']

export const render = () => {
  if (document.body && !document.body.classList.contains('trimmings')) {
    document.body.classList.add('trimmings')
  }
}
