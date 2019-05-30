test('enabled', async () => {
  const page = await browser.newPage()
  await page.goto('http://localhost:4444/enabled.html')
  await expect(page).toMatchElement('body.trimmings')
})
