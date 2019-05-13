export const render = () => {
  if (!document.body.classList.contains('redact')) {
    document.body.classList.add('redact')
  }
}
