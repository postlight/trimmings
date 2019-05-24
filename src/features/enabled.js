export const key = 'trimToggle'

export const eventNames = ['click', 'input', 'change']

export const render = () => {
  if (document.body && !document.body.classList.contains('trim')) {
    document.body.classList.add('trim')
  }
}
