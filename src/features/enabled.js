export const key = 'redactToggle'

export const eventNames = ['click', 'input', 'change']

export const render = () => {
  if (!document.body.classList.contains('redact')) {
    document.body.classList.add('redact')
  }
}
