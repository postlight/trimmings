export const name = 'Enabled (auto feature)'

export const render = () => {
  if (!document.body.classList.contains('redact')) {
    document.body.classList.add('redact')
  }
}
