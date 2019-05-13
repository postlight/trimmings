import render from './render'

const observe = () => {
  const observer = new window.MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && Object.keys(mutation.target.dataset).join(',').indexOf('redact') > -1) {
        render(mutation.target.parentNode || mutation.target)
      } else if (mutation.type === 'childList') {
        render(mutation.target)
      }
    })
  })

  observer.observe(
    document.querySelector('body'),
    { attributes: true, childList: true, subtree: true }
  )
}

export default observe
