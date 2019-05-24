export const key = 'trimAutosubmit'

export const eventNames = ['change']

export const handle = (e) => {
  const element = e.target
  const form = (element.nodeName === 'FORM') ? element : element.closest('form')

  if (form) {
    form.submit()
  }
}
