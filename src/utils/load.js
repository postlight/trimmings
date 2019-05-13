const load = (url, options = {}) =>
  window.fetch(url, options)
    .then(response => response.text())
    .then((text) => {
      const html = document.createElement('html')
      html.innerHTML = text
      return html
    })

export default load
