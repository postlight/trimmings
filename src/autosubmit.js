import match from './match'

export const selectors = [
  'form[data-redact-autosubmit]',
  'button[data-redact-autosubmit]',
  'input[data-redact-autosubmit]',
  'select[data-redact-autosubmit]',
  'textarea[data-redact-autosubmit]'
]

export const bind = (element) => {
  if (match(element, ['INPUT', 'BUTTON', 'FORM', 'SELECT', 'TEXTAREA'], 'redactAutosubmit')) {
    element.addEventListener('change', () => {
      // TODO: IE does not support Element.closest()
      const form = (element.nodeName === 'FORM') ? element : element.closest('form')
      form.submit()
    })
    element.removeAttribute('data-redact-autosubmit')
  }
}
