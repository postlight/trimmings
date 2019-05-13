const isHidden = (element) => {
  console.log('asdf', window.getComputedStyle(element).display)
  return window.getComputedStyle(element).display === 'none'
}

export default isHidden
