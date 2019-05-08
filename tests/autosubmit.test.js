test('toggle', async () => {
  const page = await browser.newPage()
  await page.goto('http://localhost:4444/autosubmit.html')
  await expect(page).toFill('.select-form-autosubmit', 'Bar')
  expect(page.url()).toContain('?foo=bar')
  await expect(page).toFill('.select-field-autosubmit', 'Baz')
  expect(page.url()).toContain('?foo=baz')
})
