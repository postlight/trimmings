export const handle = (e) => {
  const element = e.target
  const form = (element.nodeName === 'FORM') ? element : element.closest('form')
  form.submit()
}
