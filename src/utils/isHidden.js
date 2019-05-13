const isHidden = (element) => {
  return window.getComputedStyle(element).display === 'none'
}

export default isHidden
