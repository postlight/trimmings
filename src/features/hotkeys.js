export const listen = () => {
  window.addEventListener('keydown', (e) => {
    const identifier =
      [
        e.altKey ? 'Alt' : null,
        e.ctrlKey ? 'Control' : null,
        e.metaKey ? 'Meta' : null,
        e.shiftKey ? 'Shift' : null,
        !e.code.match(/Alt|Shift|Control|Meta/) ? e.code : null
      ]
        .filter(Boolean)
        .join('+')

    const element = document.querySelector(`[data-redact-hotkey~="${identifier}"]`)

    if (element) {
      element.click()
    }
  })
}
