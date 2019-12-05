const select = (page, selector, value) => page.evaluate((selector, value) => {
  const select = document.querySelector(selector)
  const option = select.querySelector(`option[value="${value}"]`)
  option.selected = true
  select.dispatchEvent(new Event('change', { bubbles: true }))
}, selector, value)

test('toggle', async () => {
  const page = await browser.newPage()
  await page.goto('http://localhost:4444/autosubmit.html')
  await select(page, '.select-form-autosubmit', 'bar')
  await page.waitForNavigation({ timeout: 200 })
  expect(page.url()).toContain('?foo=bar')
  await select(page, '.select-field-autosubmit', 'baz')
  await page.waitForNavigation({ timeout: 200 })
  expect(page.url()).toContain('?foo=baz')
})
